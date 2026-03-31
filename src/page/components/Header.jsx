import { Layout, Avatar, Dropdown, Space, Typography, Tag } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  FilePptOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader({ file }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdate = () => {
    toast.info("Tính năng đang được phát triển");
  };

  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Thông tin",
      onClick: handleUpdate,
    },
    {
      key: "2",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: handleUpdate,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        background: "linear-gradient(90deg,#1d4ed8,#7c3aed)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* LEFT */}
      <Space size={12}>
        <FilePptOutlined style={{ fontSize: 26, color: "#fff" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 600 }}>
            PowerPoint Checker
          </div>
          <Text style={{ color: "#bfdbfe", fontSize: 12 }}>
            Check slides & audio automatically
          </Text>
        </div>
      </Space>

      {/* CENTER (file name) */}
      <div>
        {file ? (
          <Tag
            color="blue"
            style={{
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 12,
            }}
          >
            📂 {file.name}
          </Tag>
        ) : (
          <Text style={{ color: "#dbeafe", fontSize: 12 }}>
            There are no files yet
          </Text>
        )}
      </div>

      {/* RIGHT (user) */}
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar
            style={{ backgroundColor: "#fff", color: "#1d4ed8" }}
            icon={<UserOutlined />}
          />
          <Text style={{ color: "#fff", fontWeight: 500 }}>
            {JSON.parse(localStorage.getItem("token"))?.username || "Hien"}
          </Text>
        </Space>
      </Dropdown>
    </Header>
  );
}