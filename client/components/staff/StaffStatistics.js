import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getNotLoanedSince, getTotal } from "../../reducers/statisticsReducer";
import { getLocations } from "../../reducers/locationReducer";
import __ from "../../langs";
import { Form, FormSelect, Input, Button } from "../essentials/forms";
import Expandable from "../essentials/Expandable";
import Loader from "../Loader";
// import { Document, View, Page, Text, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer";

// TODO: Too slow: @react-pdf/renderer
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

const StaffStatistics = ({ getLocations, locations, getNotLoanedSince, getTotal, language, statistics, loading, __ }) => {
    useEffect(() => {
        if (!locations || locations.length === 0) getLocations();
    }, []);

    const handleGetTotal = e => {
        e.preventDefault();
        getTotal();
    };

    const handleGetNotLoanedSince = e => {
        const { location, date } = e.target;
        getNotLoanedSince(location.value, null, date.value, language);
    };

    return <>
        <div>How many things in total</div>
        <button onClick={handleGetTotal}>Get</button>
        {statistics && statistics.total && <>
            <div>Items: {statistics.total.items}</div>
            <div>Records: {statistics.total.records}</div>
            <div>Users: {statistics.total.users}</div>
        </>}
        <hr />
        <Expandable title={__("Total loans")}>
            <p>Coming soon</p>
        </Expandable>

        <Expandable title={__("Not loaned since")}>
            <Form onSubmit={handleGetNotLoanedSince}>
                <FormSelect options={locations.map(l => [l.name, l.id]) || []} name="location" id="location" title={__("Location")} />
                <Input type="date" name="date" id="date" title={__("Date")} description={__("Date since item has not been loaned")} />
                <Button title={__("Get loans")} />
            </Form>
            {loading.state === 4 && <Loader />}
            {loading.state === 6 && <p>{__("Error")}: {loading.error}</p>}
            {loading.state === 5 && <>
                <p>Found {statistics.notLoanedSince && statistics.notLoanedSince.items && statistics.notLoanedSince.items.length} items</p>
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
    { getTotal, getNotLoanedSince, getLocations }
)(StaffStatistics);