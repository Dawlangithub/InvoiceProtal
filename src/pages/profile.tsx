import { Avatar, Descriptions, message, Typography } from "antd";
import { useEffect, useState } from "react";
import BAScreenWrapper from "../reuseableLayout/BAScreenWrapper";
import { BABox, BAButton, BAModal, BAPasswordInput } from "../components";
import { Post } from "../config/apimethods";

const { Title, Text } = Typography;

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordModel, setPasswordModel] = useState<any>({});
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("User");
    setUser(JSON.parse(userData || "{}"));
  }, []);

  if (!user) return null;

  const handleChangePassword = () => {
    if (passwordModel.newPassword !== passwordModel.confirmPassword) {
      message.warning("New password and confirm password do not match");
      return;
    }

    setPasswordChangeLoading(true);
    Post("/authentication/update-password", {
      userId: user.Id,
      oldPassword: passwordModel.oldPassword,
      newPassword: passwordModel.newPassword,
    })
      .then(() => {
        message.success("Password changed successfully");
        setChangePasswordModal(false);
      })
      .catch((error) => {
        message.error(
          error?.response?.data?.message || "Failed to change password"
        );
      })
      .finally(() => {
        setPasswordChangeLoading(false);
      });
  };


  return (
    <>
      {/* Change Password Modal */}
      <BAModal
        width={400}
        title={"Change Your Password"}
        open={changePasswordModal}
        close={() => {
          setPasswordModel({});
          setChangePasswordModal(false);
        }}
        content={
          <BABox className="p-4 gap-2 flex flex-col">
            {user.Roles == "Admin" ? null : (
              <BAPasswordInput
                value={passwordModel.oldPassword}
                onChange={(val: any) =>
                  setPasswordModel({
                    ...passwordModel,
                    oldPassword: val.target.value,
                  })
                }
                label={"Old Password"}
              />
            )}
            <BAPasswordInput
              value={passwordModel.newPassword}
              onChange={(val: any) =>
                setPasswordModel({
                  ...passwordModel,
                  newPassword: val.target.value,
                })
              }
              label={"New Password"}
            />
            <BAPasswordInput
              value={passwordModel.confirmPassword}
              onChange={(val: any) =>
                setPasswordModel({
                  ...passwordModel,
                  confirmPassword: val.target.value,
                })
              }
              label={"Confirm Password"}
            />
          </BABox>
        }
        footer={
          <BABox className="px-4">
            <BAButton
              className="w-full"
              label="Change Password"
              type="primary"
              onClick={() => handleChangePassword()}
              loading={passwordChangeLoading}
            />
          </BABox>
        }
      />

      {/* Profile Screen */}
      <BAScreenWrapper title="Profile">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6 mt-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            {/* Left Side - Avatar + Info */}
            <div className="flex items-center gap-4">
              <Avatar
                size={90}
                src={user.Image}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                {user.Name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <Title level={3} className="m-0">
                  {user.Name.toUpperCase()}
                </Title>
                <Text type="secondary" className="block">
                  {user.Roles}
                </Text>
              </div>
            </div>

            {/* Right Side - Change Password */}
            <BAButton
              type="primary"
              label="Change Password"
              onClick={() => setChangePasswordModal(true)}
            />
          </div>

          {/* Details Section */}
          <Descriptions
            bordered
            column={1}
            labelStyle={{
              fontWeight: 600,
              backgroundColor: "#f8f9fa",
              width: "200px",
            }}
            contentStyle={{
              backgroundColor: "white",
            }}
          >
            {user.Roles && (
              <Descriptions.Item label="User Type">
                {user.Roles}
              </Descriptions.Item>
            )}
            {user.PhoneNumber && (
              <Descriptions.Item label="Phone Number">
                {user.PhoneNumber}
              </Descriptions.Item>
            )}
            {user.UserName && (
              <Descriptions.Item label="User Name">
                {user.UserName}
              </Descriptions.Item>
            )}
            {user.Email && (
              <Descriptions.Item label="Email">
                {user.Email}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </BAScreenWrapper>
    </>
  );
}
