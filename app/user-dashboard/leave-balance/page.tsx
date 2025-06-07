// "use client";

// import { useEffect } from "react";
// import { Box, Grid, Typography, Paper, LinearProgress, Chip, Button } from "@mui/material";
// import { UserLayout } from "@/components/layout/user-layout";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { fetchLeaveBalance } from "@/lib/features/leave/leaveSlice";
// import { ModernStatCard } from "@/components/modern-stat-card";
// import BeachAccessIcon from '@mui/icons-material/BeachAccess';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AddIcon from '@mui/icons-material/Add';
// import { useRouter } from "next/navigation";

// interface LeaveTypeDetailProps {
//   title: string;
//   icon: React.ReactNode;
//   total: number;
//   used: number;
//   remaining: number;
//   color: string;
// }

// function LeaveTypeDetail({ title, icon, total, used, remaining, color }: LeaveTypeDetailProps) {
//   const percentage = (used / total) * 100;

//   return (
//     <Paper
//       sx={{
//         p: 3,
//         height: '100%',
//         borderRadius: 2,
//         boxShadow: 'rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px',
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <Box
//           sx={{
//             width: 48,
//             height: 48,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderRadius: 2,
//             bgcolor: `${color}.lighter`,
//             color: `${color}.main`,
//             mr: 2,
//           }}
//         >
//           {icon}
//         </Box>
//         <Box sx={{ flexGrow: 1 }}>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             {title}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {remaining} days remaining
//           </Typography>
//         </Box>
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//           <Typography variant="body2" color="text.secondary">
//             Usage
//           </Typography>
//           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//             {percentage.toFixed(0)}%
//           </Typography>
//         </Box>
//         <LinearProgress
//           variant="determinate"
//           value={percentage}
//           sx={{
//             height: 8,
//             borderRadius: 4,
//             bgcolor: `${color}.lighter`,
//             '& .MuiLinearProgress-bar': {
//               borderRadius: 4,
//               bgcolor: `${color}.main`,
//             },
//           }}
//         />
//       </Box>

//       <Grid container spacing={2}>
//         <Grid item xs={4}>
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="h6" sx={{ fontWeight: 700, color: `${color}.main` }}>
//               {total}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               Total
//             </Typography>
//           </Box>
//         </Grid>
//         <Grid item xs={4}>
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               {used}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               Used
//             </Typography>
//           </Box>
//         </Grid>
//         <Grid item xs={4}>
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
//               {remaining}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               Available
//             </Typography>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// }

// export default function UserLeaveBalancePage() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const { balance, isLoading } = useAppSelector((state) => state.leave);
//   const { user } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(fetchLeaveBalance());
//   }, [dispatch]);

//   const totalLeaveAllowed = balance ?
//     balance.annualLeave.total + balance.sickLeave.total + balance.casualLeave.total : 0;

//   const totalLeaveUsed = balance ?
//     balance.annualLeave.used + balance.sickLeave.used + balance.casualLeave.used : 0;

//   const totalLeaveRemaining = balance ?
//     balance.annualLeave.remaining + balance.sickLeave.remaining + balance.casualLeave.remaining : 0;

//   const leaveTypes = balance ? [
//     {
//       title: "Annual Leave",
//       icon: <BeachAccessIcon />,
//       total: balance.annualLeave.total,
//       used: balance.annualLeave.used,
//       remaining: balance.annualLeave.remaining,
//       color: "primary",
//     },
//     {
//       title: "Sick Leave",
//       icon: <LocalHospitalIcon />,
//       total: balance.sickLeave.total,
//       used: balance.sickLeave.used,
//       remaining: balance.sickLeave.remaining,
//       color: "error",
//     },
//     {
//       title: "Casual Leave",
//       icon: <EventAvailableIcon />,
//       total: balance.casualLeave.total,
//       used: balance.casualLeave.used,
//       remaining: balance.casualLeave.remaining,
//       color: "success",
//     },
//   ] : [];

//   return (
//     <UserLayout>
//       <Box>
//         {/* Page Header */}
//         <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
//               Leave Balance
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Track your leave entitlements and usage
//             </Typography>
//           </Box>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => router.push('/user-dashboard')}
//             sx={{ borderRadius: 2 }}
//           >
//             Request Leave
//           </Button>
