import React from 'react';

interface ErrorMessageProps {
    title?: string;
    message: string;
    debugDetails?: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
                                                              title = "Ojej! Coś poszło nie tak",
                                                              message,
                                                              debugDetails
                                                          }) => {
    return (
        <div className="error-box">
            <h3>⚠️ {title}</h3>
            <p>{message}</p>
            {debugDetails && (
                <div className="debug-info">
                    <strong>Debug info:</strong><br />
                    {debugDetails}
                </div>
            )}
        </div>
    );
};