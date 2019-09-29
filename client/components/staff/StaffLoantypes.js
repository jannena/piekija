import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createLoantype, getLoantypes } from "../../reducers/loantypeReducer";

const StaffLoantypes = ({ loantypes, createLoantype, getLoantypes }) => {
    useEffect(() => {
        getLoantypes();
    }, []);

    const handleCreateLoantype = e => {
        e.preventDefault();
        const { name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime } = e.target;
        createLoantype(name.value, canBePlacedAHold.checked, canBeLoaned.checked, Number(renewTimes.value), Number(loanTime.value));
    };

    return (
        <>
            <div>
                <form onSubmit={handleCreateLoantype}>
                    <input placeholder="Loantype name" name="name" />
                    <input type="checkbox" name="canBePlacedAHold" />
                    <input type="checkbox" name="canBeLoaned" />
                    <input type="number" name="renewTimes" />
                    <input type="number" name="loanTime" />
                    <button>Create loantype</button>
                </form>
            </div>
            {!!loantypes.length && <table style={{ width: "100%" }}>
                <tbody>
                    {loantypes.map(loantype =>
                        <tr key={loantype.id}>
                            <td>{loantype.name}</td>
                            <td>
                                <div>{String(loantype.canBePlacedAHold)}</div>
                                <div>{String(loantype.canBeLoaned)}</div>
                                <div>{loantype.renewTimes}</div>
                                <div>{loantype.loanTime}</div>
                            </td>
                            <td><button>Edit</button></td>
                        </tr>
                    )}
                </tbody>
            </table>}
        </>
    );
};

export default connect(
    state => ({
        loantypes: state.loantype
    }),
    { createLoantype, getLoantypes }
)(StaffLoantypes);