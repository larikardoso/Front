import React, { useContext } from 'react';
import { CircularProgress } from '@mui/material';
import { AppContext } from './context';

const LoadingIndicator = () => {
    const { loading } = useContext(AppContext);

    return (
        <>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <CircularProgress color="secondary" />
                </div>
            )}
        </>
    );
};

export default LoadingIndicator;
