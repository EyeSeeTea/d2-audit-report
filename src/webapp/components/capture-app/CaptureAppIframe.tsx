import { LinearProgress } from "material-ui";
import React from "react";
import styled from "styled-components";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import { useInterval } from "$/webapp/hooks/useInterval";

export type QueryState = {
    orgUnitId: Maybe<Id>;
    eventId: Maybe<Id>;
    edit: Maybe<number>;
    new: Maybe<number>;
};

export function buildQueryState(newState: Partial<QueryState>): QueryState {
    return {
        orgUnitId: newState.orgUnitId,
        eventId: newState.eventId,
        edit: newState.edit,
        new: newState.new,
    };
}

export interface CaptureAppIframeProps extends React.IframeHTMLAttributes<Element> {
    onQueryStateChange(queryState: QueryState): void;
    stylesOptions: StylesOptions;
    reloadKey: number;
}

export interface StylesOptions {
    programOrgUnitSelectors: boolean;
    newButton: boolean;
    buttonShowAllEvents: boolean;
    commentsBox: boolean;
}

export const CaptureAppIframe: React.FC<CaptureAppIframeProps> = props => {
    const { onQueryStateChange, stylesOptions, reloadKey, ...iframeProps } = props;
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const [isHidden, setHidden] = React.useState(true);

    useCleanAppIFrame(iframeRef, setHidden, stylesOptions);

    const prevCaptureStateRef = React.useRef<QueryState>();

    React.useEffect(() => {
        if (reloadKey) {
            iframeRef.current?.contentWindow?.location.reload();
        }
    }, [reloadKey]);

    const updateStateFromIframe = React.useCallback(() => {
        const contentWindow = iframeRef.current?.contentWindow;
        if (!contentWindow) return;
        const url = getIframeUrl(contentWindow);
        if (!url) return;

        const stateFromIframe = getQueryState(contentWindow.document, url);
        if (stateFromIframe && !isEqualQueryState(stateFromIframe, prevCaptureStateRef.current)) {
            // Don't notify initial capture state (page load)
            if (prevCaptureStateRef.current) onQueryStateChange(stateFromIframe);
            prevCaptureStateRef.current = stateFromIframe;
        }
    }, [iframeRef, prevCaptureStateRef, onQueryStateChange]);

    useInterval(100, updateStateFromIframe);

    return (
        <>
            {isHidden && <LinearProgress />}
            <IFrameStyled {...iframeProps} hidden={isHidden} ref={iframeRef} />
        </>
    );
};

const IFrameStyled = styled.iframe`
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;
    border: none;
    margin-left: 10px;
`;

function useCleanAppIFrame(
    iframeRef: React.RefObject<HTMLIFrameElement>,
    setHidden: (value: boolean) => void,
    stylesOptions: StylesOptions
) {
    const cleanIframeContents = React.useCallback(() => {
        const document = iframeRef.current?.contentWindow?.document;
        if (!document) return;

        if (addStyles(document, stylesOptions)) {
            setHidden(false);
        }
    }, [iframeRef, setHidden, stylesOptions]);

    useInterval(500, cleanIframeContents);
}

function addStyles(document: Document, options: StylesOptions): boolean {
    if (!document.head || document.head.childElementCount === 0) return false;

    const elId = "capture-app-styles";
    if (document.querySelector("#" + elId)) return true;
    const style = document.createElement("style");
    style.id = elId;

    const cssLines = [
        `
        /* Hide header */
        header { display: none !important; }
        #app > div > div > div { padding-top: 0px !important; }
        `,

        options.programOrgUnitSelectors ||
            `
            [data-test='locked-selector'] > div > div > div:nth-child(-n+2) { display: none }
            [data-test='start-again-button'] { display: none; }
        `,

        // Hide selectors: Program/Registering Unit
        `[data-test='dhis2-ui-selectorbar'] .controls > button { display: none !important; }`,
        // Hide button: Clear selections
        `[data-test='dhis2-ui-selectorbar'] .controls .clear-selections > button  { display: none !important; }`,

        `[data-test='find-button'] { display: none !important; }`,

        `[data-test='new-menuitem-two'] { display: none !important; }`,

        options.newButton || `[data-test='dhis2-ui-selectorbar'] { display: none; }`,

        options.buttonShowAllEvents ||
            `
            /* Show all events */
            [data-test='locked-selector'] + div > [data-test='dhis2-uicore-button'] { display: none; }`,

        options.commentsBox ||
            `/* Comments box on form detail */
        [data-test='dhis2-uicore-button'] + div > div:nth-child(2) { display: none }`,

        // New event / Edit event: Hide "Schedule" tab (right to "Report" tab)
        `[data-test$='-schedule-tab'] { display: none !important; }`,
    ];

    style.textContent = cssLines.filter(x => x !== true).join("\n");

    document.head.appendChild(style);
    return true;
}

function getIframeUrl(iframeWindow: Window): Maybe<string> {
    return iframeWindow ? iframeWindow.location.href : undefined;
}

function isEqualQueryState(a: QueryState | undefined, b: QueryState | undefined): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    return (
        a.orgUnitId === b.orgUnitId &&
        a.eventId === b.eventId &&
        a.edit === b.edit &&
        a.new === b.new
    );
}

/* URLS to detect:

    - programId/programId=ID
    - programId AND orgUnitId
    - viewEventId (show or edit)
*/
function getQueryState(document: Document, url: string): Maybe<QueryState> {
    const orgUnitId = url.match(/orgUnitId=(\w+)/)?.[1];
    const programId = url.match(/programId=(\w+)/)?.[1];

    const isNewEvent = Boolean(url.match(/\/new/));
    const viewEventId = url.match(/viewEventId=(\w+)/)?.[1];

    if (isNewEvent && orgUnitId) {
        return buildQueryState({ orgUnitId, new: 1 });
    } else if (viewEventId) {
        // The Capture App view does not have ids or fixed class names for sections/fields,
        // so let's simply check if there are input fields rendered.
        const inputs = document.querySelectorAll("input");
        const showMode = inputs.length === 0;
        return buildQueryState(
            showMode ? { eventId: viewEventId } : { eventId: viewEventId, edit: 1 }
        );
    } else if (programId && orgUnitId) {
        return buildQueryState({ orgUnitId });
    } else {
        return undefined;
    }
}
