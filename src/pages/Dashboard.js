import { Col, Row, Alert } from "antd";

const Dashboard = () => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Alert align="center" style={{ fontSize: 30}} message="ยินดีต้อนรับ" type="success" />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
