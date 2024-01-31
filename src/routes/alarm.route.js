// alarm.route.js
import express from "express";
import asyncHandler from 'express-async-handler';

// import controller
import { getAlarm, updateAlarm } from "../controllers/alarm.controller.js";

export const alarmtRouter = express.Router({mergeParams: true});

// 알림 조회
alarmtRouter.get('/:userId/notifications', asyncHandler(getAlarm));

// 알림 상태 업데이트
alarmtRouter.patch('/users/:userId/notifications/:alarmId', asyncHandler(updateAlarm));
