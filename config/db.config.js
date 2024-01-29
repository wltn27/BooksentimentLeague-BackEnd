import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',  // mysql�� hostname
    user: process.env.DB_USER || 'root',  // user �̸�
    port: process.env.DB_PORT || 3306,  // ��Ʈ ��ȣ
    database: process.env.DB_TABLE || 'umc_wb',  // �����ͺ��̽� �̸�
    password: process.env.DB_PASSWORD || 'password',  // ��й�ȣ
    waitForConnections: true,
		// Pool�� ȹ���� �� �ִ� connection�� ���� ��,
		// true�� ��û�� queue�� �ְ� connection�� ����� �� �ְ� �Ǹ� ��û�� �����ϸ�, false�̸� ��� ������ �������� �ٽ� ��û
    connectionLimit: 10,        // �� ���� Ŀ�ؼ��� �����Բ� �� ������
    queueLimit: 0,              // getConnection���� ������ �߻��ϱ� ���� Pool�� ����� ��û�� ���� �ѵ�
});