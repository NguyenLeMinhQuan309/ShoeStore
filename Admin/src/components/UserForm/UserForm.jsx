import { Form, Input, Row, Col, Select } from "antd";

const { Option } = Select;

const UserForm = ({ newUser, setNewUser, address, setAddress, isEditing }) => {
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
        {!isEditing ? (
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
        ) : (
          <Col span={12}>
            <Form.Item label="Email" required>
              <Input
                type="email"
                value={newUser.email}
                disabled
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </Form.Item>
          </Col>
        )}
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
          <Form.Item label="Number">
            <Input
              value={address.number}
              onChange={(e) =>
                setAddress({ ...address, number: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Street">
            <Input
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ward">
            <Input
              value={address.ward}
              onChange={(e) => setAddress({ ...address, ward: e.target.value })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="District">
            <Input
              value={address.district}
              onChange={(e) =>
                setAddress({ ...address, district: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="City">
            <Input
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
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
          <Form.Item label="Gender">
            <Select
              value={newUser.gender}
              onChange={
                (value) => setNewUser({ ...newUser, gender: value }) // Cập nhật giới tính
              }
              placeholder="Select Gender"
            >
              <Select.Option value={1}>Male</Select.Option>
              <Select.Option value={0}>Female</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
