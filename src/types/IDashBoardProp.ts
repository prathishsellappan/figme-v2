import { DesignDocument, DocumentStatus } from "../lib/documents";

export type SideNavBarProp = {
    onRecentClick: ()=> void,
    onDraftClick: ()=> void,
    recActive: boolean,
    draftActive: boolean,
}

export type ContentProp = {
    recentOrDraft: DocumentStatus
}

export type DesignFileProp = DesignDocument;
