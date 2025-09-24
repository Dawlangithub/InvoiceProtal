import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import BAModal from './BAModal';
import BAButton from './BAButton';
import BALoader from './BALoader';
import BABox from './BABox';
import { message } from 'antd';
import {
    UploadOutlined,
} from '@ant-design/icons';
import BAIconButton from './BAIconButton';

type propsType = {
    onPickRecords?: any,
    sampleFileURL?: string,
    sampleFileName?: string
    fileDownloadApi?: string
}

export default function BAExcelUpload(props: propsType) {
    const { onPickRecords, sampleFileURL, fileDownloadApi, sampleFileName } = props
    const [excelData, setExcelData] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false)
    const [property] = useState({
        dataLoader: false,
    })
    const inputRef = useRef<any>(null);

    const onDrop = (acceptedFiles: any) => {
        const file = acceptedFiles[0];
        if (!file) {
            message.error('No file selected');
            return;
        }
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/vnd.ms-excel') {
            message.error('Invalid file type. Please upload an Excel file.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
            const binaryString = e.target.result;
            const workbook = XLSX.read(binaryString, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            let arr: any[] = []
            let keys: any = data[0]
            data.forEach((x: any, i: any) => {
                let obj: any = {}
                if (i != 0) {
                    x.forEach((col: any, colInd: any) => {
                        obj[keys[colInd]] = col
                    });
                    arr.push(obj)
                }
            })
            setExcelData([...arr]);
        };

        reader.readAsBinaryString(file);
    };

    const downloadFile = () => {
        if (fileDownloadApi) {
            const URL = `http://192.168.19.97:3200/${fileDownloadApi}`;
            const a = document.createElement('a');
            a.href = URL;
            a.download = sampleFileName ?? "sample_template.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            // For local files in public folder
            const localUrl = sampleFileURL ?? './invoice_import_template_final.xlsx';
            const a = document.createElement('a');
            a.href = localUrl;
            a.download = sampleFileName ?? "sample_template.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }


    return (<>
        <BABox className='hidden md:block'>
            <BAButton label="Upload" onClick={() => { setOpenModal(true); }} icon={<UploadOutlined />} />
        </BABox>
        <BABox className='md:hidden block'>
            <BAIconButton onClick={() => { setOpenModal(true); }} icon={<UploadOutlined />} />
        </BABox>
        <BAModal
            title='Excel Upload'
            width='60vw'
            open={openModal}
            close={() => {
                setExcelData([])
                setOpenModal(false)
                inputRef.current.value = null;
            }}
            content={<>
                <BABox>
                    <BABox>
                        {property.dataLoader ? <BALoader /> : <input
                            accept='.xlsx, .xls, .csv'
                            disabled={property.dataLoader}
                            onChange={(e: any) => {
                                onDrop(e.target.files)
                            }}
                            ref={inputRef}
                            className='excelPickerInput cursor-pointer p-24 hover:bg-gray-100 bg-gray-300 rounded-lg w-full border-3 border-dashed border-gray-400 text-2xl'
                            type='file'
                        />}
                    </BABox>
                </BABox>
            </>}
            footer={<>
                <BABox className='p-2 text-end flex justify-end items-center'>
                    <BABox className='pe-2'>
                        <BAButton
                            onClick={() => {
                                downloadFile()
                            }}
                            label='Download Sample File'
                        />
                    </BABox>
                    <BAButton
                        onClick={() => {
                            if (onPickRecords) {
                                if (excelData.length < 1) {
                                    message.error('No record filled in Excel File')
                                } else {
                                    onPickRecords([...excelData]);
                                    setOpenModal(false)
                                    inputRef.current.value = null;
                                }
                            }
                        }}
                        label='Pick Record'
                    />
                </BABox>
            </>}
        />
    </>
    );
}


