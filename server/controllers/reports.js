const mongoose = require('mongoose');
const User = mongoose.model('User');
const Ticket = mongoose.model('Ticket');
const _ = require("lodash");
const json2csv = require('json2csv');
const fs = require("fs")

module.exports = {
	downloadReport
}

function downloadReport(req, res){

	let result = null;

	switch(req.params.report) {
		case "tickets":
			 getTicketsReport(req,res)
		break;
	}

/*	res.status(200);
	req.json({})*/
}

function getTicketsReport(req,res){

	let fields = [
		"id заявки",
		"Создатель заявки",
	 	"Заявитель",
		"Телефон заявителя",
		"Описание",
		"Статус",
		"Работник",
		"Дата создания",
		"Время создания",
	 	"Дата план. завершения",
		"Время план. завершения",
		"Дата завершения",
		"Время завершения"
		];


	All({
		tickets: Ticket.find({}).exec(),
		users: User.find({}).exec()
	}).then((resp)=>{
		let ticketsReportJson = _.map(resp.tickets, ticket=>{
			let ticketObj = {}
			
			ticketObj["id заявки"] = ticket.id;
			ticketObj["Создатель заявки"] = ticket.isExternal?"Гражданин":"Диспетчер";
		 	ticketObj["Заявитель"] = ticket.declarantName;
			ticketObj["Телефон заявителя"] = ticket.declarantPhone;
			ticketObj["Описание"] = ticket.description;
			ticketObj["Статус"] = ticket.statusTitle();
			ticketObj["Работник"] = _.find(resp.users, (user) => user.id == ticket.workerId).name || "Не назначен";
			ticketObj["Дата создания"] = ticket.createdDate;
			ticketObj["Время создания"] = ticket.createdTime;
		 	ticketObj["Дата план. завершения"] = ticket.closedDatePlanned;
			ticketObj["Время план. завершения"] = ticket.closedTimePlanned;
			ticketObj["Дата завершения"] = ticket.closedDate || "Не установлено";
			ticketObj["Время завершения"] = ticket.closedTime || "Не установлено";

			return ticketObj;
		})

		console.log(ticketsReportJson)

		const result = json2csv({ data: ticketsReportJson, fields: fields});
		fs.writeFileSync(__dirname+"/temp/report.csv", result)
		res.download(__dirname+"/temp/report.csv", "Заявки.csv");
	}).catch((err)=>{
		res.status(500)
		res.json({message: "err.message"})
	})

}
