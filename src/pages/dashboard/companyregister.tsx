import { useEffect, useState } from 'react';
import { message } from 'antd';
import { BABox, BAButton, BAFormElement, BAPera } from "../../components";
import { formElement } from '../../components/BAComponentSwitcher';
import einvoiceLogo from "../../assets/einvoiceLogo.png";
import { Post } from '../../config/apimethods';
import { customDecrypt, customEncrypt } from '../../config/helpers';
import { useLocation, useNavigate } from 'react-router';
import { firebaseLogout } from '../../config/firebase/firebasefunction';

export default function CompanyRegister() {
    const [model, setModel] = useState<any>({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<any>({});

    const location = useLocation();
    const state = location.state || {};
    const { registerType } = state;

    const formElements: formElement[] = [
        {
            col: 12,
            elementType: "heading",
            key: "companyHeader",
            label: "Company Information"
        },
        {
            col: 6,
            elementType: "input",
            key: "compName",
            label: "Company Name",
            placeholder: "Enter company name",
            required: true
        },
        {
            col: 12,
            elementType: "input",
            key: "address1",
            label: "Address Line 1",
            placeholder: "Enter primary address",
            required: true
        },
        {
            col: 6,
            elementType: "input",
            key: "address2",
            label: "Address Line 2",
            placeholder: "Enter additional address details"
        },
        {
            col: 6,
            elementType: "input",
            key: "address3",
            label: "Address Line 3",
            placeholder: "Enter additional address details"
        },
        {
            col: 6,
            elementType: "input",
            key: "city",
            label: "City",
            placeholder: "Enter city name",
            required: true
        },
        {
            col: 6,
            elementType: "select",
            key: "state",
            label: "State/Province",
            required: true,
            options: [
                { label: "PUNJAB", value: "PUNJAB" },
                { label: "SINDH", value: "SINDH" },
                { label: "KHYBER PAKHTUNKHWA", value: "KHYBER PAKHTUNKHWA" },
                { label: "BALOCHISTAN", value: "BALOCHISTAN" },
                { label: "GILGIT BALTISTAN", value: "GILGIT BALTISTAN" },
                { label: "AZAD JAMMU AND KASHMIR", value: "AZAD JAMMU AND KASHMIR" }
            ]
        },
        {
            col: 12,
            elementType: "heading",
            key: "contactHeader",
            label: "Contact Information"
        },
        {
            col: 4,
            elementType: "input",
            key: "phone1",
            label: "Primary Phone",
            placeholder: "Enter primary phone number",
            required: true
        },
        {
            col: 4,
            elementType: "input",
            key: "phone2",
            label: "Secondary Phone",
            placeholder: "Enter secondary phone number"
        },
        {
            col: 4,
            elementType: "input",
            key: "mobile",
            label: "Mobile Number",
            placeholder: "Enter mobile number",
            required: true
        },
        {
            col: 6,
            elementType: "input",
            key: "fullName",
            label: "Full Name",
            placeholder: "Enter full name",
            required: true
        },
        {
            col: 6,
            elementType: "input",
            key: "email",
            label: "Email Address",
            placeholder: "Enter email address",
            type: "email",
            disabled: registerType != 'signup',
            required: true
        },
        {
            col: 12,
            elementType: "heading",
            key: "taxHeader",
            label: "Tax Information"
        },
        {
            col: 4,
            elementType: "input",
            key: "strn",
            label: "Sales Tax Registration Number",
            placeholder: "Enter STRN"
        },
        {
            col: 4,
            elementType: "input",
            key: "ntn",
            label: "National Tax Number",
            placeholder: "Enter NTN"
        },
        {
            col: 4,
            elementType: "input",
            key: "cnic",
            label: "CNIC Number",
            placeholder: "Enter CNIC number"
        },
        {
            col: 12,
            elementType: "heading",
            key: "credentialsHeader",
            label: "Contact Person"
        },

        {
            col: 6,
            elementType: "input",
            key: "contactPerson",
            label: "Contact Person",
            placeholder: "Enter contact person name",
            required: true
        },
    ];

    const onSaveClick = () => {
        setSaveLoading(true);
        // Add your API call here to save the company registration
        Post(registerType === "signup" ? 'auth/self-register' : 'auth/register-client', model, null, null, true)
            .then((res: any) => {
                if (registerType === "signup") {
                    navigate("/login", { replace: true })
                    message.success("Registration successful! Please check your email to verify your account.");
                } else {
                    message.success("Company registration submitted successfully!");
                    // Redirect or other success handling
                    localStorage.setItem("FBR_APP_TOKEN", res.accessToken)
                    localStorage.setItem("FBR_APP_USER", customEncrypt(JSON.stringify(res.user)))
                    navigate("/", { replace: true })
                }
            })
            .catch((err) => {
                message.error(err?.message || "Registration failed");
            })
            .finally(() => {
                setSaveLoading(false);
            });
    };

    const navigate = useNavigate();

    const logout = async () => {
        await firebaseLogout()
        localStorage.removeItem("FBR_APP_TOKEN")
        localStorage.removeItem("FBR_APP_USER")
        navigate("/login", { replace: true })
    }


    useEffect(() => {

        if (registerType === "signup") {

        } else {
            let user: any = localStorage.getItem("User")
            if (!user) {
                navigate("/login", { replace: true })
                return;
            }
            user = JSON.parse(customDecrypt(user) || "{}")
            if (user) {
                setLoggedInUser({ ...loggedInUser, ...user })
                setModel({
                    ...model,
                    fullName: user.fullName,
                    phone1: user.phone,
                    email: user.email,
                })
            } else {
                navigate("/login", { replace: true })
            }
        }

    }, [])

    return (<BABox>
        <BABox className="bg-gradient-to-b from-[#e5f9f9] to-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 bg-[#13999E]/5 grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="h-32 bg-white/50 rounded-lg transform rotate-12 backdrop-blur-sm"></div>
                ))}
            </div>

            {/* Content */}
            {loggedInUser && <BABox className='flex justify-end items-center mb-6'>
                {!registerType && <BAButton onClick={logout} label="Logout" />}
            </BABox>}
            <BABox className="relative max-w-4xl mx-auto text-center">
                <img src={einvoiceLogo} alt="eSync Logo" className="h-20 mx-auto mb-6 drop-shadow-md" />
                <h1 className="text-4xl font-bold text-[#13999E] mb-4 tracking-tight">
                    Company Registration
                </h1>
                <BAPera className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Join the eSync platform to streamline your FBR compliance and invoice management
                </BAPera>

                {/* Features or benefits */}
                <BABox className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {/*
                        { number: '500+', text: 'Companies Trust Us' },
                        { number: '24/7', text: 'Support Available' },
                        { number: '99.9%', text: 'Uptime Guaranteed' },
                    */}
                </BABox>
            </BABox>
        </BABox>

        <BABox className="max-w-6xl mx-auto -mt-6 relative z-10 bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <BAFormElement
                onSaveClick={onSaveClick}
                model={model}
                setModel={setModel}
                formElement={formElements}
                saveLoader={saveLoading}
            />
        </BABox>
    </BABox>
    );
}