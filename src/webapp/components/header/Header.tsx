import React, { useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import { AuditSelector, ViewKey } from "$/webapp/components/audit-selector/AuditSelector";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import i18n from "$/utils/i18n";
import Icon from "@material-ui/core/Icon";

type HeaderProps = {
    currentViewKey: ViewKey;
    onChangeView(view: ViewKey): void;
    hasD2LoggerAudits: boolean;
    hasGutterBottom: boolean;
    title?: string;
    d2LoggerTabTitle?: string;
    dhis2TabTitle?: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
};

export const Header: React.FC<HeaderProps> = React.memo(props => {
    const {
        currentViewKey,
        onChangeView,
        hasD2LoggerAudits,
        hasGutterBottom,
        title,
        d2LoggerTabTitle,
        dhis2TabTitle,
        showBackButton,
        onBackClick,
    } = props;

    const handleOnBackClick = useCallback(() => {
        if (showBackButton) {
            if (onBackClick) {
                onBackClick();
            } else {
                window.history.back();
            }
        }
    }, [onBackClick, showBackButton]);

    return hasD2LoggerAudits ? (
        <HeaderContainer>
            <FlexWrapper>
                {showBackButton && (
                    <BackButton
                        onClick={handleOnBackClick}
                        color="secondary"
                        aria-label={i18n.t("Back")}
                        data-test={"page-header-back"}
                    >
                        <Icon color="primary">arrow_back</Icon>
                    </BackButton>
                )}

                <Title variant="h5" gutterBottom={hasGutterBottom}>
                    {title || "\u00A0"}
                </Title>
            </FlexWrapper>

            <AuditSelector
                showLabels={true}
                currentViewKey={currentViewKey}
                onChange={onChangeView}
                d2LoggerTabTitle={d2LoggerTabTitle}
                dhis2TabTitle={dhis2TabTitle}
            />
        </HeaderContainer>
    ) : (
        <>
            {showBackButton && (
                <BackButton
                    onClick={handleOnBackClick}
                    color="secondary"
                    aria-label={i18n.t("Back")}
                    data-test={"page-header-back"}
                >
                    <Icon color="primary">arrow_back</Icon>
                </BackButton>
            )}

            {title && (
                <Title variant="h5" gutterBottom={hasGutterBottom}>
                    {title}
                </Title>
            )}
        </>
    );
});

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
    min-height: 40px;
`;

const Title = styled(Typography)`
    && {
        display: inline-block;
        font-weight: 300;
        flex: 1;
        min-width: 0;
        align-self: center;
    }

    visibility: ${props => (props.children === "\u00A0" ? "hidden" : "visible")};
`;

const BackButton = styled(IconButton)`
    padding-top: 10px;
    margin-bottom: 5px;
`;

const FlexWrapper = styled.div`
    display: flex;
    align-items: center;
`;
