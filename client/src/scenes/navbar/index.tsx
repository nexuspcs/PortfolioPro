import { useState } from "react";
import { Link } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";

type Props = {};

const Navbar = (props: Props) => {
    const { palette } = useTheme();
    const [selected, setSelected] = useState("Dashboard");
    return (
        <FlexBetween mb="0.25rem" p="0.5rem 0 rem" color={palette.grey[300]}>
            {/* left side */}
            <FlexBetween gap="0.75rem">
                <PixIcon />
            </FlexBetween>
        </FlexBetween>
    );
};

export default Navbar