const express = require('express');
const { F_Insert, F_Select, F_Check, F_Delete, CreateActivity } = require('../modules/MasterModule');
const dateFormat = require('dateformat');
const ActivationRouter = express.Router();

ActivationRouter.get('/get_active_emp_list', async (req, res) => {
	var flag = req.query.flag,
		frm_dt = dateFormat(new Date(), "yyyy-mm-dd"),
		to_dt = dateFormat(new Date(), "yyyy-mm-dd"),
		table_name = 'td_team_log a JOIN td_team_members b ON a.team_id=b.team_id JOIN md_teams c ON a.team_id=c.id LEFT JOIN td_activation e ON a.team_id=e.team_id',
		select = `a.team_id, c.team_name, a.from_date, a.to_date, (SELECT COUNT(d.id) FROM td_team_members d WHERE a.team_id=d.team_id GROUP BY d.team_id) as no_of_emp, (SELECT f.active_flag FROM td_activation f WHERE e.team_id = f.team_id AND f.id = MAX(e.id) GROUP BY f.team_id) AS active_flag`,
		//whr = `a.team_id=b.team_id AND a.team_id=c.id AND a.from_date <= "${frm_dt}" AND a.to_date >= "${to_dt}"`,
		whr = `(a.from_date <= "${frm_dt}" AND a.to_date >= "${to_dt}") OR (e.active_flag = 'Y')`
	group = `GROUP BY a.team_id`,
		res_dt = '';
	var dt = await F_Select(select, table_name, whr, group);
	if (flag > 0) {
		table_name = 'td_team_log a, td_team_members b, md_teams c',
			select = `a.team_id, c.team_name, a.from_date, a.to_date, (SELECT COUNT(d.id) FROM td_team_members d WHERE a.team_id=d.team_id GROUP BY d.team_id) as no_of_emp`;
		whr = `a.team_id=b.team_id AND a.team_id=c.id AND a.team_id != ${dt.msg[0].team_id}`;
		group = `GROUP BY a.team_id`;
		res_dt = await F_Select(select, table_name, whr, group);
	} else {
		res_dt = dt;
	}
	res.send(res_dt);
})

ActivationRouter.post('/activation', async (req, res) => {
	var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	var data = req.body;
	// UPDATE ALL PREVIOUSLY ACTIVATED DATA //
	var update_table = 'td_activation',
		update_fields = `active_flag = "N", modified_by = "${data.user}", modified_at = "${datetime}"`,
		// update_whr = `inc_id = "${data.inc_id}" AND active_flag = "Y"`,
		update_whr = `active_flag = "Y"`,
		update_values = null,
		update_flag = 1;
	var update_rs = await F_Insert(update_table, update_fields, null, update_whr, 1);
	//////////////////////////////////////////////////////
	var table_name = 'td_activation',
		//fields = data.id > 0 ? `inc_id = "${data.inc_id}", team_id = "${data.team_id}", active_flag = "${data.flag}", modified_by = "${data.user}", modified_at = "${datetime}"` :
		// '(inc_id, team_id, active_flag, created_by, created_at)',
		fields = '(inc_id, team_id, active_flag, created_by, created_at)',
		values = `("${data.inc_id}", "${data.team_id}", "${data.flag}", "${data.user}", "${datetime}")`,
		whr = null,
		flag = 0,
		flag_type = flag > 0 ? 'Deactivated' : 'Assigned';

	var user_id = data.user,
		act_type = flag > 0 ? 'M' : 'C',
		activity = `A Team ${data.team_name} is ${flag_type} for the incident named ${data.inc_name} BY ${data.user} AT ${datetime}`;
	var activity_res = await CreateActivity(user_id, datetime, act_type, activity);

	var dt = await F_Insert(table_name, fields, values, whr, flag),
		res_dt = flag > 0 ? dt : { suc: dt.suc, msg: dt.msg };
	res.send(res_dt)
})

ActivationRouter.get('/get_active_status', async (req, res) => {
	var frm_dt = req.query.frm_dt,
		to_dt = req.query.to_dt,
		inc_id = req.query.inc_id,
		team_id = req.query.team_id,
		table_name = 'td_activation',
		select = `IF(COUNT(id) > 0, active_flag, 'N') as active_flag`,
		whr = `DATE(created_at) >= "${frm_dt}" AND DATE(created_at) <= "${to_dt}" AND inc_id = "${inc_id}" AND team_id = "${team_id}"`,
		group = null;
	var dt = await F_Select(select, table_name, whr, group);
	res.send(dt);
})

module.exports = { ActivationRouter };