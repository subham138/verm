const express = require('express');
const { F_Select } = require('../modules/MasterModule');
const dateFormat = require('dateformat');
const ReportRouter = express.Router();

/////////////////////////////// ALL OPEN/CLOSE INCIDENT DETAILS ///////////////////////////////////////
ReportRouter.get('/get_all_incident', async (req, res) => {
    var table_name = 'td_incident',
        select = 'id, inc_no, inc_name',
        whr = null,
        order = `ORDER BY inc_no`;
    var dt = await F_Select(select, table_name, whr, order);
    res.send(dt);
})

/////////////////////////////// INCIDENT REPORT VIEW ///////////////////////////////////////
ReportRouter.get('/incident_report', async (req, res) => {
    var frm_dt = req.query.frm_dt,
        to_dt = req.query.to_dt,
        inc_id = req.query.inc_id,
        inc_whr = inc_id > 0 ? `AND a.id = ${inc_id}` : '',
        table_name = 'td_incident a, md_incident_type b, md_location c, md_tier d, md_employee e',
        select = `a.id, a.inc_no, DATE_FORMAT(a.inc_dt, "%d/%m/%Y %h:%i:%s %p") inc_dt, b.incident_name inc_type_name, a.inc_name, c.offshore_name, c.location_name, c.offshore_latt latt, c.offshore_long o_long, d.tier_type initial_tier, a.inc_status, a.brief_desc, a.close_date, (SELECT f.tier_type FROM md_tier f WHERE a.final_tier_id=f.id) final_tier, a.closing_remarks, a.approval_status, e.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT g.emp_name FROM md_employee g WHERE a.approved_by=g.email) approved_by, a.approval_status, DATE_FORMAT(a.approved_at, "%d/%m/%Y %h:%i:%s %p") approved_at, (SELECT h.emp_name FROM md_employee h WHERE a.modified_by=h.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at, (SELECT i.emp_name FROM md_employee i WHERE a.closed_by=i.email) closed_by, DATE_FORMAT(a.closed_at, "%d/%m/%Y %h:%i:%s %p") closed_at`,
        whr = `a.inc_type_id=b.id AND a.inc_location_id=c.id AND a.initial_tier_id=d.id AND a.created_by=e.email AND DATE(a.inc_dt) >= "${frm_dt}" AND DATE(a.inc_dt) <= "${to_dt}" ${inc_whr}`,
        order = `ORDER BY a.inc_no DESC`;
    var dt = await F_Select(select, table_name, whr, order);
    res.send(dt);
    //`SELECT ${select} FROM ${table_name} ${whr}`
})

/////////////////////////////// FETCH ALL TYPES OF BOARD DATA ///////////////////////////////////////
ReportRouter.get('/board_report', async (req, res) => {
    var inc_id = req.query.inc_id,
        board_id = req.query.board_id;
    var table_name = '',
        select = '',
        whr = '',
        order = '',
        dt = '';
    switch (board_id) {
        case "1": // INCIDENT BOARD
            table_name = 'td_inc_board a, td_incident b, md_employee c';
            select = `a.id, b.inc_no, DATE_FORMAT(a.date, "%d/%m/%Y") date, a.installation, a.coordinates, a.visibility, a.wind_speed, a.wind_direc, a.sea_state, a.temp, a.summary, a.status, c.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT d.emp_name FROM md_employee d WHERE a.modified_by=d.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at`;
            whr = `a.inc_id=b.id AND a.created_by=c.email AND a.inc_id = "${inc_id}"`;
            order = 'ORDER BY a.id';
            dt = await F_Select(select, table_name, whr, order);
            break;
        case "2": // VESSEL BOARD
            table_name = 'td_vessel_board a, td_incident b, md_employee c';
            select = `a.id, b.inc_no, DATE_FORMAT(a.date, "%d/%m/%Y %h:%i:%s %p") date, a.vessel_name, a.vessel_type, a.form_at, a.etd, a.to_at, a.eta, a.remarks, c.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT d.emp_name FROM md_employee d WHERE a.modified_by=d.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at`;
            whr = `a.inc_id=b.id AND a.created_by=c.email AND a.inc_id = "${inc_id}"`;
            order = 'ORDER BY a.id';
            dt = await F_Select(select, table_name, whr, order);
            break;
        case "3": // HELICOPTER BOARD
            table_name = 'td_helicopter_board a, td_incident b, md_employee c';
            select = `a.id, b.inc_no, DATE_FORMAT(a.date, "%d/%m/%Y %h:%i:%s %p") date, a.call_sign, a.heli_type, a.form_at, a.etd, a.to_at, a.eta, a.remarks, c.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT d.emp_name FROM md_employee d WHERE a.modified_by=d.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at`;
            whr = `a.inc_id=b.id AND a.created_by=c.email AND a.inc_id = "${inc_id}"`;
            order = 'ORDER BY a.id';
            dt = await F_Select(select, table_name, whr, order);
            break;
        case "4": // PROB BOARD
            var time = [{ 'from': '00:00:00', 'to': '03:59:59', 'serial': 1 }, { 'from': '04:00:00', 'to': '07:59:59', 'serial': 2 }, { 'from': '08:00:00', 'to': '11:59:59', 'serial': 3 }, { 'from': '12:00:00', 'to': '15:59:59', 'serial': 4 }, { 'from': '16:00:00', 'to': '19:59:59', 'serial': 5 }, { 'from': '20:00:00', 'to': '23:59:59', 'serial': 6 }];
            var res_dt = {};
            for (let i = 0; i < time.length; i++) {
                table_name = 'td_prob_board a, md_prob_category b';
                select = `a.prob_cat_id, b.name as prob_cat, SUM(a.value) AS value, "${time[i].serial}" as serial`;
                whr = `a.prob_cat_id=b.id AND a.time >= '${time[i].from}' AND a.time <= '${time[i].to}' AND a.inc_id = "${inc_id}"`;
                order = 'GROUP BY b.id ORDER BY b.id';
                var result = await F_Select(select, table_name, whr, order);
                res_dt[time[i].serial] = result.msg;
            }
            dt = { suc: 1, msg: res_dt };
            break;
        case "5": // CASULTY BOARD
            table_name = 'td_casualty_board a, td_incident b, md_employee c, md_location e';
            select = `a.id, b.inc_no, DATE_FORMAT(a.date, "%d/%m/%Y %h:%i:%s %p") date, a.full_name, a.employer, a.emp_condition, e.offshore_name, e.location_name, e.offshore_latt, e.offshore_long, DATE_FORMAT(a.time, "%h:%i:%s %p") time, c.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT d.emp_name FROM md_employee d WHERE a.modified_by=d.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at`;
            whr = `a.inc_id=b.id AND a.created_by=c.email AND a.location=e.id AND a.inc_id = "${inc_id}"`;
            order = 'ORDER BY a.id';
            dt = await F_Select(select, table_name, whr, order);
            break;
        case "6": // EVACUATION BOARD
            table_name = 'td_evacuation_board a, td_incident b, md_employee c, md_location e';
            select = `a.id, b.inc_no, DATE_FORMAT(a.date, "%d/%m/%Y %h:%i:%s %p") date, e.offshore_name, e.location_name, e.offshore_latt, e.offshore_long, a.mode_of_transport, a.pob_remaining, a.remarks, c.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT d.emp_name FROM md_employee d WHERE a.modified_by=d.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at`;
            whr = `a.inc_id=b.id AND a.created_by=c.email AND a.destination=e.id AND a.inc_id = "${inc_id}"`;
            order = 'ORDER BY a.id';
            dt = await F_Select(select, table_name, whr, order);
            break;
        case "7": // EVENT LOG BOARD
            table_name = 'td_events_log_board a, td_incident b, md_employee c';
            select = `a.id, b.inc_no, DATE_FORMAT(a.date, "%d/%m/%Y %h:%i:%s %p") date, a.situation_status, a.resource_assigned, c.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT d.emp_name FROM md_employee d WHERE a.modified_by=d.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at`;
            whr = `a.inc_id=b.id AND a.created_by=c.email AND a.inc_id = "${inc_id}"`;
            order = 'ORDER BY a.id';
            dt = await F_Select(select, table_name, whr, order);
            break;

        default:
            break;
    }
    res.send(dt);
})

/////////////////////////////// ACTIVATION MODULE REPORT ///////////////////////////////////////
ReportRouter.get('/activation_report', async (req, res) => {
    var frm_dt = req.query.frm_dt,
        to_dt = req.query.to_dt,
        inc_id = req.query.inc_id,
        inc_whr = inc_id > 0 ? `AND a.inc_id = ${inc_id}` : '',
        table_name = 'td_activation a, md_employee b, td_incident c, md_teams d, md_team_type e',
        select = `a.id, c.inc_no, c.inc_name, d.team_name, e.team_type, e.team_short_code, a.active_flag, b.emp_name created_by, DATE_FORMAT(a.created_at, "%d/%m/%Y %h:%i:%s %p") created_at, (SELECT f.emp_name FROM md_employee f WHERE a.modified_by=f.email) modified_by, DATE_FORMAT(a.modified_at, "%d/%m/%Y %h:%i:%s %p") modified_at`,
        whr = `a.created_by=b.email AND a.inc_id=c.id AND a.team_id=d.id AND d.team_type_id=e.id AND DATE(a.created_at) >= "${frm_dt}" AND DATE(a.created_at) <= "${to_dt}" ${inc_whr}`,
        order = `ORDER BY a.inc_id DESC`;
    var dt = await F_Select(select, table_name, whr, order);
    res.send(dt);
})

/////////////////////////////// CHAT MODULE REPORT ///////////////////////////////////////
ReportRouter.get('/chat_report', async (req, res) => {
    var inc_id = req.query.inc_id,
        frm_dt = req.query.frm_dt,
        to_dt = req.query.to_dt,
        table_name = 'td_chat a, md_employee b',
        select = `a.id, a.inc_id, CONCAT(IF(DATE(NOW()) = DATE(a.chat_dt), 'Today', DATE_FORMAT(a.chat_dt, "%d/%m/%Y")), ' ', DATE_FORMAT(a.chat_dt, "%h:%i:%s %p")) as chat_dt, a.employee_id, a.chat, b.emp_name, a.file, IF(a.file != '', 1, 0) file_flag`,
        whr = `a.employee_id=b.employee_id AND a.inc_id = ${inc_id} AND DATE(a.chat_dt) >= "${frm_dt}" AND DATE(a.chat_dt) <= "${to_dt}"`,
        order = `ORDER BY a.id`;
    var dt = await F_Select(select, table_name, whr, order);
    res.send(dt);
})

/////////////////////////////// AUTO LOG REPORT ///////////////////////////////////////
ReportRouter.get('/autolog_report', async (req, res) => {
    var inc_id = req.query.inc_id,
        frm_dt = req.query.frm_dt,
        to_dt = req.query.to_dt;
    var table_name = 'td_activity a, md_employee b',
        select = `a.id, a.inc_id, b.emp_name, DATE_FORMAT(a.act_at, "%d/%m/%Y %h:%i:%s %p") AS act_at, IF(a.act_type = 'C', 'Created', IF(a.act_type = 'M', 'Modified', 'Deleted')) AS act_type, a.activity`,
        whr = `a.act_by=b.email AND a.act_by != "admin@gmail.com" AND a.inc_id = ${inc_id} AND DATE(a.act_at) >= "${frm_dt}" AND DATE(a.act_at) <= "${to_dt}" AND act_type != 'W'`;
    var dt = await F_Select(select, table_name, whr, null);
    res.send(dt);
})

/////////////////////////////// MANUAL LOG REPORT ///////////////////////////////////////
ReportRouter.get('/manuallog_report', async (req, res) => {
    var inc_id = req.query.inc_id,
        frm_dt = req.query.frm_dt,
        to_dt = req.query.to_dt;
    var table_name = 'td_activity a',
        select = `a.id, a.inc_id, a.act_by, DATE_FORMAT(a.act_at, "%d/%m/%Y %h:%i:%s %p") AS act_at, a.act_type, a.activity`,
        whr = `a.act_by != "admin@gmail.com" AND a.inc_id = ${inc_id} AND DATE(a.act_at) >= "${frm_dt}" AND DATE(a.act_at) <= "${to_dt}" AND act_type = 'W'`;
    var dt = await F_Select(select, table_name, whr, null);
    res.send(dt);
})

/////////////////////////////// CALL LOG REPORT ///////////////////////////////////////
ReportRouter.get('/call_log_report', async (req, res) => {
    var inc_id = req.query.inc_id,
        frm_dt = req.query.frm_dt,
        to_dt = req.query.to_dt;
    var table_name = 'td_call_log',
        select = `id, inc_id, ref_no, made_by, made_to, received_by, DATE_FORMAT(call_datetime, "%d/%m/%Y %h:%i:%s %p") AS call_datetime, call_datetime as call_dt, call_details`,
        whr = `delete_flag = 'N' AND inc_id = ${inc_id} AND DATE(call_datetime) >= "${frm_dt}" AND DATE(call_datetime) <= "${to_dt}"`;
    var dt = await F_Select(select, table_name, whr, null);
    res.send(dt);
})

module.exports = { ReportRouter }