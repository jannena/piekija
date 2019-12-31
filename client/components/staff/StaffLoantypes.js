import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createLoantype, getLoantypes, removeLoantype, updateLoantype } from "../../reducers/loantypeReducer";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, Checkbox, Grid, DoNotSendButton } from "../essentials/forms";
import { Table, TableRow, TableCell } from "../essentials/Tables";
import __ from "../../langs";

const StaffLoantypes = ({ loantypes, createLoantype, getLoantypes, removeLoantype, updateLoantype, __ }) => {
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
            <Input id={`${data.id}-name`} value={data.name} title={__("Name")} name="name" />
            <Checkbox id={`${data.id}-cbph`} checked={data.canBePlacedAHold} type="checkbox" name="canBePlacedAHold" title={__("canBePlacedAHold")} />
            <Checkbox id={`${data.id}-cabl`} checked={data.canBeLoaned} type="checkbox" name="canBeLoaned" title={__("canBeLoaned")} description={__("canBeLoaned-info")} />
            <Input id={`${data.id}-rent`} value={data.renewTimes} type="number" name="renewTimes" title={__("renewTimes")} description={__("renewTimes-info")} />
            <Input id={`${data.id}-loat`} value={data.loanTime} type="number" name="loanTime" title={__("loanTime")} description={__("loanTime.info")} />
            <Grid>
                <DoNotSendButton title={__("remove-button")} onClick={handleRemoveLoantype(data.id)} />
                <Button title={__("create-button")} />
            </Grid>
        </Form>
    </>;

    return (
        <>
            <Expandable title={__("Create new loantype")}>
                <Form onSubmit={handleCreateLoantype}>
                    <Input title={__("Name")} name="name" />
                    <Input type="checkbox" name="canBePlacedAHold" title={__("canBePlacedAHold")} />
                    <Input type="checkbox" name="canBeLoaned" title={__("canBeLoaned")} description={__("canBeLoaned-info")} />
                    <Input type="number" name="renewTimes" title={__("renewTimes")} description={__("renewTimes-info")} />
                    <Input type="number" name="loanTime" title={__("loanTime")} description={__("loanTime-info")} />
                    <Button title={__("create-button")} />
                </Form>
            </Expandable>
            <Table widths={[40, 15, 15, 15, 15]} titles={[__("Name"), __("canBePlacedAHold"), __("canBeLoaned"), __("renewTimes"), __("loanTime")]} form={form} data={loantypes}>
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
        loantypes: state.loantype,
        __: __(state)
    }),
    { createLoantype, getLoantypes, removeLoantype, updateLoantype }
)(StaffLoantypes);