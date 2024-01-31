// alarm.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
//import { getUserId } from "../models/sentiment.sql.js";

import { getAlarmService } from "../services/alarm.service.js";
import { updateAlarmService } from "../services/alarm.service.js";


// 알림 조회
export const getAlarm = async (req, res, next ) => {
    console.log("알림 조회 요청");
    console.log("body", req.body);
    res.send(response(status.SUCCESS, await getAlarmService(req.params.userId, req.body)));
}

// 알림 상태 업데이트
export const updateAlarm = async (req, res, next ) => {
    console.log("알림 상태 업데이트 요청");
    console.log("body", req.body);
    res.send(response(status.SUCCESS, await updateAlarmService(req.params.sentimentId, req.body)));
   
}