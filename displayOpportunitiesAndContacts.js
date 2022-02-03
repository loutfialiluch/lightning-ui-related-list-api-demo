import { LightningElement, api, wire } from "lwc";
import { getRelatedListRecords } from "lightning/uiRelatedListApi";
import { getRecord } from "lightning/uiRecordApi";

export default class DisplayOpportunitiesAndContacts extends LightningElement {
    @api
    recordId;

    account;
    contacts;
    opportunities;

    get recordsLoaded() {
        return this.contacts && this.opportunities;
    }

    // Getting the parent account informations
    @wire(getRecord, { recordId: "$recordId", fields: ["Account.Name"] })
    wiredAccount({ data, error }) {
        if (error) {
            console.error(error);
        }
        // Sometimes the "error" property returned is undefined  and the data returned is also undefined
        // so we need to double check before trying to access data
        else if (data) {
            this.account = {};
            Object.keys(data.fields).forEach((key) => {
                this.account[key] = data.fields[key].value;
            });
        }
    }

    // Getting the related contacts of the parent account with the use lightning/uiRelatedListApi
    @wire(getRelatedListRecords, {
        parentRecordId: "$recordId",
        relatedListId: "Contacts",
        fields: ["Contact.Name", "Contact.Id"]
    })
    contactRelatedListRecords({ data, error }) {
        if (error) {
            console.error(error);
        } else if (data) {
            this.contacts = this.getRecords(data.records);
        }
    }

    // Getting the related opportunities of the parent account with the use lightning/uiRelatedListApi
    @wire(getRelatedListRecords, {
        parentRecordId: "$recordId",
        relatedListId: "Opportunities",
        fields: ["Opportunity.Name", "Opportunity.Id"]
    })
    opportunityRelatedListRecords({ data, error }) {
        if (error) {
            console.error(error);
        } else if (data) {
            this.opportunities = this.getRecords(data.records);
        }
    }

    // *********** HELPER METHODS **************
    getRecords(wiredRecords) {
        return wiredRecords.map(({ fields: wiredRecord }) => {
            const newRecord = {};
            Object.keys(wiredRecord).forEach((key) => {
                newRecord[key] = wiredRecord[key].value;
            });
            return newRecord;
        });
    }
    // *********** /HELPER METHODS **************
}
