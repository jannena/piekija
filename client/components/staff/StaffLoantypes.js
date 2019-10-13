import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createLoantype, getLoantypes, removeLoantype, updateLoantype } from "../../reducers/loantypeReducer";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, Checkbox } from "../essentials/forms";
import { Table, TableRow, TableCell } from "../essentials/Tables";

const StaffLoantypes = ({ loantypes, createLoantype, getLoantypes, removeLoantype, updateLoantype }) => {
    useEffect(() => {
        getLoantypes();
    }, []);

    const handleCreateLoantype = e => {
        const { name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime } = e.target;
        createLoantype(name.value, canBePlacedAHold.checked, canBeLoaned.checked, Number(renewTimes.value), Number(loanTime.value));
    };

    const handleUpdateLoantype = id => e => {
        const { name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime } = e.target;
        updateLoantype(id, name.value, canBePlacedAHold.checked, canBeLoaned.checked, Number(renewTimes.value), Number(loanTime.value));
    };

    const handleRemoveLoantype = id => e => {
        removeLoantype(id);
    };

    const form = data => <>
        <Form onSubmit={handleUpdateLoantype(data.id)}>
            <Input id={`${data.id}-name`} value={data.name} title="Name" name="name" />
            <Checkbox id={`${data.id}-cbph`} checked={data.canBePlacedAHold} type="checkbox" name="canBePlacedAHold" title="Can be placed a hold" />
            <Checkbox id={`${data.id}-cabl`} checked={data.canBeLoaned} type="checkbox" name="canBeLoaned" title="Can be loaned" description="If true, users cannot loan this item" />
            <Input id={`${data.id}-rent`} value={data.renewTimes} type="number" name="renewTimes" title="Renew times" description="How many times item can be renewed" />
            <Input id={`${data.id}-loat`} value={data.loanTime} type="number" name="loanTime" title="Loan time" description="How many days is the loan time" />
            <Button title="Create" />
        </Form>
        <Form onSubmit={handleRemoveLoantype(data.id)}>
            <Button title="Remove" />
        </Form>
    </>;

    return (
        <>
            <Expandable title="Create new loantype">
                <Form onSubmit={handleCreateLoantype}>
                    <Input title="Name" name="name" />
                    <Input type="checkbox" name="canBePlacedAHold" title="Can be placed a hold" />
                    <Input type="checkbox" name="canBeLoaned" title="Can be loaned" description="If true, users cannot loan this item" />
                    <Input type="number" name="renewTimes" title="Renew times" description="How many times item can be renewed" />
                    <Input type="number" name="loanTime" title="Loan time" description="How many days is the loan time" />
                    <Button title="Create" />
                </Form>
            </Expandable>
            <Table widths={[40, 15, 15, 15, 15]} titles={["Name", "canBePlacedAHold", "canBeLoaned", "renewTimes", "loanTime"]} form={form} data={loantypes}>
                {loantypes.map(l => <TableRow key={l.id}>
                    <TableCell>{l.name}</TableCell>
                    <TableCell>{String(l.canBePlacedAHold)}</TableCell>
                    <TableCell>{String(l.canBeLoaned)}</TableCell>
                    <TableCell>{l.renewTimes}</TableCell>
                    <TableCell>{l.loanTime}</TableCell>
                </TableRow>)}
            </Table>
        </>
    );
};

export default connect(
    state => ({
        loantypes: state.loantype
    }),
    { createLoantype, getLoantypes, removeLoantype, updateLoantype }
)(StaffLoantypes);