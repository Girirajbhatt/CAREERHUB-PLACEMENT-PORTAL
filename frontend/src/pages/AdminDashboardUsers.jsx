import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
    Activity,
    ArrowUpRight,
    CircleUser,
    CreditCard,
    DollarSign,
    Menu,
    Package2,
    Search,
    Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotebookPen } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AdminDashboardUsers() {
    const [userEntries, setUserEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/admin-dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelName: 'users' }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }

            const responseData = await response.json();
            setUserEntries(responseData.data);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to fetch entries');
        } finally {
            setIsLoading(false);
        }
    };

    const Spinner = () => (
        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
        </svg>
    );

    const handleLogout = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/v1/user/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            navigate('/login')
          } else {
            console.error('Failed to logout:', response.statusText);
          }
        } catch (error) {
          console.error('Failed to logout:', error);
        }
      };
    return (
        <div>
                        <header className="sticky top-0 flex h-16 items-center gap-4 bg-background px-4 md:px-6 border-b-2 bg-blue-700 text-white border-blue-600">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link
                        to="/admin/dashboard"
                        className=" transition-colors hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/dashboard/search"
                        className=" transition-colors hover:text-foreground"
                    >
                        Search
                    </Link>
                    <Link
                        to="/admin/dashboard/users"
                        className=" transition-colors text-foreground"
                    >
                        Users
                    </Link>
                    <Link
                        to="/admin/dashboard/jobs"
                        className=" transition-colors hover:text-foreground"
                    >
                        Jobs
                    </Link>
                    <Link
                        to="/admin/dashboard/applications"
                        className="hover:text-foreground"
                    >
                        Applications
                    </Link>
                    <Link
                        to="/admin/dashboard/analytics"
                        className=" transition-colors hover:text-foreground"
                    >
                        Analytics
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium ">
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link to="/admin/dashboard" className="hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/dashboard/search"
                                className="hover:text-foreground"
                            >
                                Search
                            </Link>
                            <Link
                                to="/admin/dashboard/users"
                                className="text-foreground"
                            >
                                Users
                            </Link>
                            <Link
                                to="/admin/dashboard/jobs"
                                className="hover:text-foreground"
                            >
                                Jobs
                            </Link>
                            <Link
                                to="/admin/dashboard/applications"
                                className="hover:text-foreground"
                            >
                                Applications
                            </Link>
                            <Link
                                to="/admin/dashboard/analytics"
                                className="hover:text-foreground"
                            >
                                Analytics
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="relative ml-auto flex-1 sm:flex-initial"></div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                                <Link to='/admin/account'>Account</Link>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            {isLoading ? (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            ) : errorMessage ? (
                <div className="text-red-500 text-center mt-4">{errorMessage}</div>
            ) : userEntries.length === 0 ? (
                <div className="text-center mt-4">No entries found.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                        <h2 className='text-2xl lg:text-4xl lg:mx-10 md:mx-8 mx-2 font-semibold'>User Data</h2>
                    </div>
                    {userEntries.map((entry, index) =>
                    (
                        <Card key={index} className='lg:mx-16 md:mx-8 mx-2 my-3'>
                            <div className='bg-[#294f7c] text-white rounded-t-lg flex items-center justify-between px-4 py-2'>
                                <h2 className="text-lg font-semibold ">User : {index + 1}</h2>
                                <h2>{entry._id}</h2>
                            </div>
                            <CardContent>
                                <div className='flex flex-col gap-y-1 pt-2'>
                                    <p><span className='font-medium'>Username :</span>{entry.userName}</p>
                                    <p><span className='font-medium'>Email:</span> {entry.email}</p>
                                    <p><span className='font-medium'>Contact No:</span> {entry.contactNo}</p>
                                    <p><span className='font-medium'>Role: </span>{entry.role}</p>
                                    <p><span className='font-medium'>Created At: </span>{new Date(entry.createdAt).toLocaleString()}</p>
                                    <p><span className='font-medium'>Updated At: </span>{new Date(entry.updatedAt).toLocaleString()}</p>
                                    <p><span className='font-medium'>Image :</span>{entry.image ? entry.image.slice(0, 40) + '...' : ' None'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboardUsers;
