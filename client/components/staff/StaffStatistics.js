import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getNotLoanedSince, getTotalLoans, getTotal } from "../../reducers/statisticsReducer";
import __ from "../../langs";
import { Form, FormSelect, Input, Button } from "../essentials/forms";
import Expandable from "../essentials/Expandable";
import Loader from "../Loader";
// import { Document, View, Page, Text, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer";

// Too slow: @react-pdf/renderer
/* const PDFDocument = ({ items }) => {
    Font.register({ family: "Trebuchet MS" })
    Font.register({ family: "'Trebuchet MS', Helvetica, sans-serif" })
    const styles = StyleSheet.create({
        page: {},
        section: {
            margin: 10,
            padding: 10,
            display: "flex"
        },
        text: {
            // width: "50%",
            // fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
            // fontSize: "1em"
        }
    })

    return <Document>
        <Page size="A4" style={styles.page}>
            {items.map(([barcode, title]) => <View style={styles.section} key={barcode}>
                <Text style={styles.text}>{barcode}</Text>
                <Text style={styles.text}>{title}</Text>
            </View>)}
        </Page>
    </Document>;
}; */

const StaffStatistics = ({ locations, getNotLoanedSince, getTotalLoans, getTotal, language, statistics, loading, __ }) => {
    const handleGetTotal = e => {
        e.preventDefault();
        getTotal();
    };

    const handleGetToalLoans = e => {
        e.preventDefault();
        getTotalLoans();
    };

    const handleGetNotLoanedSince = e => {
        const { location, date } = e.target;
        getNotLoanedSince(location.value, null, date.value, language);
    };

    return <>
        <p>{__("more-statistics-info")}</p>
        <Expandable title={__("How many things in total")}>
            <button onClick={handleGetTotal}>{__("Get")}</button>
            {statistics && statistics.total && <>
                <div>{__("Items")}: {statistics.total.items}</div>
                <div>{__("Records")}: {statistics.total.records}</div>
                <div>{__("Users")}: {statistics.total.users}</div>
            </>}
        </Expandable>
        <Expandable title={__("Total loans")}>
            <button onClick={handleGetToalLoans}>{__("Get")}</button>
            {statistics && statistics.totalLoans && <>
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    "Total loans;Loans;Item count\n" +
                    statistics.totalLoans.map(i => i.join(";")).join("\n")
                )}`} download="piekija.totalloans.csv">{__("Download CSV")}</a>
            </>}
        </Expandable>

        <Expandable title={__("Not loaned since")}>
            <Form onSubmit={handleGetNotLoanedSince}>
                <FormSelect options={locations.map(l => [l.name, l.id]) || []} name="location" id="location" title={__("Location")} />
                <Input type="date" name="date" id="date" title={__("Date")} description={__("Date since item has not been loaned")} />
                <Button title={__("Get")} />
            </Form>
            {loading.state === 4 && <Loader />}
            {loading.state === 6 && <p>{__("Error")}: {loading.error}</p>}
            {loading.state === 5 && statistics.notLoanedSince && <>
                <p>{__("Found")} {statistics.notLoanedSince && statistics.notLoanedSince.items && statistics.notLoanedSince.items.length} {__("items")}</p>
                {/* <PDFDownloadLink
                    fileName="piekija.notloanedsince.pdf"
                    document={<PDFDocument items={statistics.notLoanedSince.items} />}
                    className="buttonLikeLink"
                >{__("Download PDF")}</PDFDownloadLink> */}
                {/* <button onClick={handleDownloadPDF}>{__("Download PDF")}</button> */}
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    statistics.notLoanedSince.title + "\n" +
                    statistics.notLoanedSince.items.map(i => i.join(";")).join("\n")
                )}`} download="piekija.notloanedsince.csv">{__("Download CSV")}</a>
                {/* <button onClick={handleDownloadCSV}>{__("Download CSV")}</button> */}
            </>}
        </Expandable>
    </>;
};

export default connect(
    state => ({
        locations: state.location,
        language: state.language,
        statistics: state.statistics,
        loading: state.loading.statistics,
        __: __(state)
    }),
    { getTotal, getNotLoanedSince, getTotalLoans }
)(StaffStatistics);