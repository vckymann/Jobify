import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  otp: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({name,otp}: EmailTemplateProps) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>Here is your verification code: {otp}</p>
  </div>
);
