import { useState } from "react";
import { updateUserNickname } from "../services/userProfileApi";

export const useProfileModalForm = ({ currentUser, nickname, setNickname, onClose }) => {
  const [newNickname, setNewNickname] = useState("");
  const [error, setError] = useState("");

  const handleChangeNickname = async () => {
    const normalizedNickname = newNickname.trim();

    try {
      setError("");

      if (normalizedNickname === nickname) {
        setError("현재 닉네임과 같습니다.");
        return;
      }

      await updateUserNickname(currentUser.uid, normalizedNickname);
      setNickname(normalizedNickname);
      setNewNickname("");
      onClose();
      alert("닉네임이 변경되었습니다.");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    newNickname,
    error,
    setNewNickname,
    handleChangeNickname,
  };
};
