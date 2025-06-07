import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  alpha,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface ModernStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function ModernStatCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend,
  onClick,
}: ModernStatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "visible",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow:
                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              bgcolor: alpha((theme) => theme.palette[color].main, 0.12),
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
          <IconButton size="small" sx={{ mt: -1, mr: -1 }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {(subtitle || trend) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {trend.isPositive ? (
                  <TrendingUpIcon
                    sx={{ width: 20, height: 20, color: "success.main" }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{ width: 20, height: 20, color: "error.main" }}
                  />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: trend.isPositive ? "success.main" : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {trend.value}%
                </Typography>
              </Box>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
