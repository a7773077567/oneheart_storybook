const messages: [string, string][] = [
  ['Same type and name shiftTemplate already exists', '班別類別及班別名稱已經存在'],
  ['startTime must be before endTime', '班別開始時間必須早於結束時間'],
  ['userShift is not allow to update or delete', '此排班不允許更改或刪除'],
  ['maxClients should not be empty or null', '請輸入人數上限'],
  ['Out of range value for column \'maxClients\' at row 1', '人數上限過高'],
  ['maxClientsForCoachClass should not be empty or null', '請輸入教練課人數'],
  ['invalid shiftTemplate type for current space', '此場館無法新增此種班別'],
  ['Same type and name groupClass already exists', '此團課名稱已經存在'],
  ['appointment system and registration system time interval overlap', '此時段已安排時間重疊的班別'],
  ['Not able to create more groupClasses', '無法再安排其他團課'],
];

export default messages;
