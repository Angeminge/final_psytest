import React from "react";

const ProgressBar = (props) => {
    const { completed } = props;

    const containerStyles = {
        height: 30,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 40,
        marginTop: 10,
        marginBottom: 30
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: "#21A038",
        borderRadius: 'inherit',
        textAlign: 'right',
    }

    const labelStyles = {
        padding: 10,
        color: 'white',
        fontWeight: 'bold',

    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;