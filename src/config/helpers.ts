import { message } from "antd";
import { formElement } from "../components/BAComponentSwitcher";
const encryptionKey = `ESync_2025-FBR-Portal`;
import dayjs from "dayjs";


export const formattedNumber = (numString: any) => {
  return numString ? Number(numString).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : '0.00';
}

export const formattedDate = (dateString: any) => {
  return dateString ? new Date(dateString).toLocaleDateString() : 0;
}
export const formattedDateTime = (dateString: any) => {
  return dayjs(dateString).subtract(5, "hour").format("DD-MM-YYYY - HH:mm A");
}

export const goBack = () => {
  window.history.back()
}

export const checkRequired = (elements: formElement[], model: any) => {
  let missing: any = []
  elements.forEach(x => {
    if (x.required) {
      if (x.elementType == 'boolean') {
        if ((typeof model[x.key] !== 'boolean')) {
          missing.push(`Required ${x.label}`)
        }
      } if (x.type == 'number') {
        if (model[x.key] === undefined || model[x.key] === null || model[x.key] === '') {
          missing.push(`Required ${x.label}`)
        } else if (isNaN(model[x.key])) {
          missing.push(`Invalid ${x.label}`)
        }

      } else {
        if (!model[x.key]) {
          missing.push(`Required ${x.label}`)
        }
      }
    }
  })
  if (missing.length > 0) {
    message.error(missing)
    return false
  } else {
    return true
  }
}



export const customEncrypt = (input: any) => {
  let result = '';
  let val = JSON.stringify(input)
  for (let i = 0; i < val.length; i++) {
    const charCode = (val.charCodeAt(i) + encryptionKey.charCodeAt(i % encryptionKey.length)) % 256;
    result += String.fromCharCode(charCode);
  }
  return result;
}

export const customDecrypt = (input: any) => {
  // Handle null, undefined, or empty inputs
  if (!input || typeof input !== 'string' || input.length === 0) {
    return null;
  }
  
  try {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      const charCode = (input.charCodeAt(i) - encryptionKey.charCodeAt(i % encryptionKey.length) + 256) % 256;
      result += String.fromCharCode(charCode);
    }
    return JSON.parse(result);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

export const removeEmptyRows = (list: any[], key: string) => {
  if (!list || !key) return [];

  if (key.includes(',')) {
    const reqKeys = key.split(',').map(k => k.trim());
    return list.filter(item =>
      // Check if any of the keys has a value in this item
      reqKeys.some(reqKey => Boolean(item[reqKey]))
    );
  } else {
    // Single key case remains the same
    return list.filter(item => Boolean(item[key]));
  }
};

export const printContentSafe = (body: any, config?: any) => {

  const { pageType = 'A4', allowHeader = false, allowFooter = true, orientation = "portrait" } = (config || {})

  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    message.error('Pop-up blocked. Please allow pop-ups for this site.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            counter-reset: page;
          }
          
          /* Print-specific styles */
          @page {
            size: ${pageType || 'A4'} ${orientation || 'portrait'};
            margin-top: 1cm;
            margin-right: 0.5cm;
            margin-bottom: 2cm;
            margin-left: 0.5cm;
            
            /* Custom headers and footers using @page */
            ${allowHeader ? `
            @top-center {
              content: "My Custom Heeader";
              font-weight: bold;
              font-family: Arial, sans-serif;
            }
            @top-right {
              content: "Date: " attr(data-print-date);
            }
            @top-left {
              content: "Reference: DOC-2025";
            }` : ''}
            
            ${allowFooter ? `
            @bottom-center {
              content:  "Page " counter(page) " of " counter(pages);
            }
            @bottom-left {
              content: "https://www.finosys.com";
              color: #777777;
            }
            @bottom-right {
              content: "${new Date().toLocaleDateString()}";
            }` : ''}
          }
          
          /* CSS counter for page numbers */
          .page-counter {
            counter-increment: page;
          }
          
          @media print {
            body {
              /* Enable background graphics/colors printing */
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Other common print settings */
            html, body {
              /* A4 dimensions in portrait */
              width: 210mm;
              height: 283mm;
            }
            
            /* For custom label size if needed */
            .custom-size {
              width: 2.625cm;
              height: 1.0cm;
            }
            
            
            /* Optional: Hide specific elements when printing */
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body data-print-date="${new Date().toLocaleDateString()}">
       ${body}       
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print(); // No parameters - they're set via CSS
    }, 10);
  };

  printWindow.onafterprint = () => {
    printWindow.close();
  };
}


export const checkRights = () => {
  const adminRoutes = [
    'client',
    'clientform',
    'user',
    'userform',
    'uom',
    'uomform',
    'tax',
  ];
  const token = localStorage.getItem("Token");
  if (!token) {
    return false;
  }
  const userInc = localStorage.getItem("User");
  if (!userInc) return false;
  let user;
  try {
    user = JSON.parse(customDecrypt(userInc));
  } catch {
    return false;
  }
  const type = user?.userType;
  const currentRoute = window.location.pathname.replace(/^\//, '').toLowerCase();

  if (type === "admin") {
    // Admins have access to adminRoutes only
    return adminRoutes.some(route => currentRoute.includes(route));
  } else {
    // Non-admins are denied access to adminRoutes
    return !adminRoutes.some(route => currentRoute.includes(route));
  }
};

export const formatDateDMY = (dateString: string | Date): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);

  return `${day}-${month}-${year}`;
}