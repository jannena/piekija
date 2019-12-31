import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLocations, createLocation, updateLocation, removeLocation } from "../../reducers/locationReducer";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, Text, DoNotSendButton, Grid } from "../essentials/forms";
import { Table, TableCell, TableRow } from "../essentials/Tables";
import __ from "../../langs";

const StaffLocations = ({ locations, getLocations, createLocation, updateLocation, removeLocation, __ }) => {
    useEffect(() => {
        getLocations();
    }, []);

    console.log("locations", locations);

    const handleCreateLocation = e => {
        e.preventDefault();
        createLocation(e.target.name.value);
    };

    const handleUpdateLocation = id => e => {
        e.preventDefault();
        updateLocation(id, e.target.name.value);
    };

    const handleRemoveLocation = id => e => {
        e.preventDefault();
        removeLocation(id);
    };

    const form = data => <div>
        <Text type="text" disabled={true} title={__("Loan times")} value={data.totalLoanCount || 0} />
        <Form onSubmit={handleUpdateLocation(data.id)}>
            <Input id={`${data.id}-name`} name="name" title={__("Location name")} value={data.name} description={__("location-name-info")} />
            <Grid>
                <DoNotSendButton onClick={handleRemoveLocation(data.id)} title={__("remove-button")} />
                <Button title={__("save-button")} />
            </Grid>
        </Form>
    </div>

    return (
        <div>
            <Expandable title={__("Create new location")}>
                <Form onSubmit={handleCreateLocation}>
                    <Input name="name" title={__("Location name")} description={__("location-name-info")} />
                    <Button title={__("create-button")} />
                </Form>
            </Expandable>
            <Table titles={[__("Name")]} widths={[100]} form={form} data={locations}>
                {locations.map(l => <TableRow>
                    <TableCell>{l.name}</TableCell>
                </TableRow>)}
            </Table>
        </div>
    );
};

export default connect(
    state => ({
        locations: state.location,
        __: __(state)
    }),
    { getLocations, createLocation, updateLocation, removeLocation }
)(StaffLocations);