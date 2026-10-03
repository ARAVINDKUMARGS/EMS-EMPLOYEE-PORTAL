import { useState } from "react";

import ProfileCard from "../components/profile/ProfileCard";
import PersonalForm from "../components/profile/PersonalForm";
import EmploymentForm from "../components/profile/EmploymentForm";
import SkillsForm from "../components/profile/SkillsForm";
import DocumentsForm from "../components/profile/DocumentsForm";
import EmergencyForm from "../components/profile/EmergencyForm";

import "../css/profile/Profile.css";
import "../css/profile/Personal.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "employment":
        return <EmploymentForm />;
      case "skills":
        return <SkillsForm />;
      case "documents":
        return <DocumentsForm />;
      case "emergency":
        return <EmergencyForm />;
      default:
        return <PersonalForm />;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-title">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-tabs">
        <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>
          Personal
        </button>
        <button className={activeTab === "employment" ? "active" : ""} onClick={() => setActiveTab("employment")}>
          Employment
        </button>
        <button className={activeTab === "skills" ? "active" : ""} onClick={() => setActiveTab("skills")}>
          Skills
        </button>
        <button className={activeTab === "documents" ? "active" : ""} onClick={() => setActiveTab("documents")}>
          Documents
        </button>
        <button className={activeTab === "emergency" ? "active" : ""} onClick={() => setActiveTab("emergency")}>
          Emergency
        </button>
      </div>

      <div className="profile-content">
        <div className="personal-container">
          <div className="personal-left">
            <ProfileCard />
          </div>
          <div className="personal-right">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}