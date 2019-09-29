import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLocations, createLocation } from "../../reducers/locationReducer";
import StaffLocation from "./StaffLocation";

const StaffLocations = ({ locations, getLocations, createLocation }) => {
    useEffect(() => {
        getLocations();
    }, []);

    console.log("locations", locations);

    const handleCreateLocation = e => {
        e.preventDefault();
        createLocation(e.target.locationname.value);
    };

    return (
        <>
            <div>
                <form onSubmit={handleCreateLocation}>
                    <input placeholder="Location name" name="locationname" />
                    <button>Create location</button>
                </form>
            </div>
            {!!locations.length ? <table>
                <tbody>
                    {locations.map(location =>
                        <StaffLocation key={location.id} location={location} />
                    )}
                </tbody>
            </table> : <p>No locations</p>}
        </>
    );
};

export default connect(
    state => ({
        locations: state.location
    }),
    { getLocations, createLocation }
)(StaffLocations);