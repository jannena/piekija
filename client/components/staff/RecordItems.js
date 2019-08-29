import React from "react";
import { connect } from "react-redux";

const RecordItems = ({ items }) => {
    if (!items) return <p>No items...</p>

    console.log("record items", items);

    return (
        <>
            <button>Add item</button>
            <table style={{ width: "100%" }}>
                <tbody>
                    {items.map(item =>
                        <tr>
                            <td>{item._id}</td>
                            <td>{item.location.name}</td>
                            <td>{item.state}</td>
                            <td>{item.note}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default connect(
    state => ({
        items: state.record.record.result ? state.record.record.result.items : null
    })
)(RecordItems);