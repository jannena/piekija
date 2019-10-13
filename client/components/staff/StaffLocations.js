import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLocations, createLocation, updateLocation, removeLocation } from "../../reducers/locationReducer";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button } from "../essentials/forms";
import { Table, TableCell, TableRow } from "../essentials/Tables";

const StaffLocations = ({ locations, getLocations, createLocation, updateLocation, removeLocation }) => {
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
        <Form onSubmit={handleUpdateLocation(data.id)}>
            <Input id={`${data.id}-name`} name="name" title="Location name" value={data.name} />
            <Button title="Save" />
        </Form>
        <Form onSubmit={handleRemoveLocation(data.id)}>
            <Button title="Remove" />
        </Form>
    </div>

    return (
        <div>
            <Expandable title="Create new location">
                <Form onSubmit={handleCreateLocation}>
                    <Input name="name" title="Location name" description="Visible for all users" />
                    <Button title="Create location" />
                </Form>
            </Expandable>
            <Table titles={["Name"]} widths={[100]} form={form} data={locations}>
                {locations.map(l => <TableRow>
                    <TableCell>{l.name}</TableCell>
                </TableRow>)}
            </Table>
        </div>
    );
};

export default connect(
    state => ({
        locations: state.location
    }),
    { getLocations, createLocation, updateLocation, removeLocation }
)(StaffLocations);