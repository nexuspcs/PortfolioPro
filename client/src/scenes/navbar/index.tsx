import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import FlexBetween from '@/components/FlexBetween';

type Props = {}

const Navbar = (props: Props) => {
    const { palette } = useTheme();
    return (
        <FlexBetween 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
        ></FlexBetween>
    );
};

export default Navbar