import {Card} from "primereact/card";
import {Button} from "primereact/button";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

export function Profile() {
    const [passVis, setPassVis] = useState(false);
    const [pass] = useState(localStorage.getItem('password'));
    const [dialogVis, setDialogVis] = useState(false);
    const [dialogPass, setDialogPass] = useState(localStorage.getItem('password'));

    return <div className="w-full flex justify-content-center">
        <Card title="Profile" className='mt-4 w-6 flex flex-row border-round-3xl'>
            <i className='pi pi-user' color='primary-500' style={{ fontSize: '8rem' }}/>
            <div className='m-4'>Username: {localStorage.getItem('username')}</div>
            <div className='m-4 flex'>
                <div className='w-15rem'>Password: {passVis ? pass !== null ? pass : '' : '******'}</div>
                <Button icon='pi pi-eye' onClick={() => setPassVis(!passVis)} style={{ backgroundColor: '#ffffff', color: '#4b5563', border: 0, height: '16px', width: '16px', marginRight: '8px'}}/>
                <Button icon='pi pi-pencil' onClick={() => setDialogVis(true)} style={{ backgroundColor: '#ffffff', color: '#4b5563', border: 0, height: '16px', width: '16px'}}/>
                <BaseEditDialog header='Изменение пароля' visible={dialogVis} setVisible={setDialogVis}
                                onCancel={() => {
                                    setDialogPass(localStorage.getItem('password'));
                                    setDialogVis(false)
                                }}
                                onSave={() => {
                                    if (dialogPass !== null) {
                                        localStorage.setItem('password', dialogPass)
                                        setDialogVis(false)
                                    } else {
                                        setDialogVis(false)
                                    }
                                }}
                                content={
                    <InputText
                        minLength={4}
                        value={dialogPass !== null ? dialogPass : ''}
                        onChange={(e) => setDialogPass(e.target.value)}
                    />
                } />
            </div>
        </Card>
    </div>
}

export interface BaseEditDialogProps {
    header: string;
    headerStyle?: React.CSSProperties;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    content: JSX.Element;
    onSave: () => void;
    onCancel: () => void;
}

export const BaseEditDialog = ({
                                   header,
                                   headerStyle,
                                   visible,
                                   setVisible,
                                   content,
                                   onSave,
                                   onCancel,
                               }: BaseEditDialogProps) => {
    const footerContent = (
        <div>
            <Button
                label="Отменить"
                icon="pi pi-times"
                onClick={() => {
                    onCancel()
                    setVisible(false);
                }}
                className="p-button-text body-text"
            />
            <Button
                label="Сохранить"
                icon="pi pi-check"
                onClick={() => {
                    onSave()
                    setVisible(false);
                }}
                autoFocus
                className="bg-primary-500 pl-4 pr-4"
            />
        </div>
    );

    return (
        <Dialog
            headerStyle={headerStyle}
            header={header}
            visible={visible}
            style={{ borderWidth: 0 }}
            onHide={() => setVisible(false)}
            footer={footerContent}
        >
            {content}
        </Dialog>
    );
};