import { Form, Input, Row, Col, Select } from "antd";

const { Option } = Select;

const UserForm = ({ newUser, setNewUser, isEditing }) => {
  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name" required>
            <Input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Email" required>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        {!isEditing ? (
          <Col span={12}>
            <Form.Item label="Password" required>
              <Input.Password
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </Form.Item>
          </Col>
        ) : (
          ""
        )}
        <Col span={12}>
          <Form.Item label="Phone">
            <Input
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Address">
            <Input
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Role">
            <Select
              value={newUser.role}
              onChange={(value) => setNewUser({ ...newUser, role: value })}
            >
              <Option value="customer">Customer</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Gender (0=Female, 1=Male)">
            <Input
              type="number"
              value={newUser.gender}
              onChange={(e) =>
                setNewUser({ ...newUser, gender: e.target.value })
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
