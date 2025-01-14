// src/components/LanguageSwitcher.tsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange("en")}>English</button>
      <button onClick={() => handleLanguageChange("hn")}>Hindi</button>
      <p>{t("Welcome")}</p>
    </div>
  );
};

export default LanguageSwitcher;
