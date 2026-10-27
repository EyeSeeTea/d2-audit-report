WITH unioned AS (
    SELECT
        dva.created,
        dva.modifiedby,
        dva.audittype,
        dva.value,
        'dataValue' AS datatype,
        CONCAT(
            'Start date: ', COALESCE(to_char(p.startdate, 'YYYY-MM-DD'), ''), E'\n',
            'End date: ', COALESCE(to_char(p.enddate, 'YYYY-MM-DD'), ''), E'\n',
            'Organisation Unit: ', COALESCE(ou.name, ou.uid, ''), E'\n',
            'Data Element: ', COALESCE(de.name, de.uid, ''), E'\n',
            'Attribute Option Combo: ', COALESCE(aoc.name, aoc.uid, ''), E'\n',
            'Category Option Combo: ', COALESCE(coc.name, coc.uid, ''), E'\n',
            'Datasets: ', COALESCE(datasets.dataset_names, '')
        ) AS related
    FROM datavalueaudit dva
    LEFT JOIN period p ON dva.periodid = p.periodid
    LEFT JOIN organisationunit ou ON dva.organisationunitid = ou.organisationunitid
    LEFT JOIN dataelement de ON dva.dataelementid = de.dataelementid
    LEFT JOIN categoryoptioncombo aoc ON dva.attributeoptioncomboid = aoc.categoryoptioncomboid
    LEFT JOIN categoryoptioncombo coc ON dva.categoryoptioncomboid = coc.categoryoptioncomboid
    LEFT JOIN (
    SELECT
        de.dataelementid,
        STRING_AGG(
            DISTINCT COALESCE(ds.name, ds.uid),
            ', ' ORDER BY COALESCE(ds.name, ds.uid)
        ) AS dataset_names
    FROM datasetelement de
    JOIN dataset ds ON de.datasetid = ds.datasetid
    GROUP BY de.dataelementid
) datasets ON dva.dataelementid = datasets.dataelementid
     WHERE dva.created >= '${startDate}'::date
      AND dva.created < ('${endDate}'::date + INTERVAL '1 day')
      AND (
        '${username}' = 'ALL' OR
        MD5(dva.modifiedby) = '${username}'
      )
      AND (
        '${dataType}' = 'ALL' OR
        '${dataType}' = 'dataValue'
      )
      AND (
        '${excludedUser}' = 'ANY' OR
        MD5(dva.modifiedby) != '${excludedUser}'
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        CASE '${includeDescendants}'
            WHEN 'true' THEN
                ou.path IS NOT NULL AND EXISTS (
                    SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
                    WHERE ou.path LIKE '%/' || trim(t.uid) || '/%' OR ou.path LIKE '%/' || trim(t.uid)
                )
            ELSE
                ou.uid = ANY(string_to_array('${orgUnitIds}', '_'))
        END
      )
      AND (
        '${datasetId}' = 'ALL' OR
        EXISTS (
            SELECT 1
            FROM datasetelement dse
            JOIN dataset ds2 ON ds2.datasetid = dse.datasetid
            WHERE dse.dataelementid = dva.dataelementid
              AND ds2.uid = '${datasetId}'
        )
      )

    UNION ALL

    SELECT
       tedva.created,
       tedva.createdby AS modifiedby,
       tedva.changelogtype AS audittype,
       COALESCE(tedva.currentvalue, tedva.previousvalue) AS value,
       'trackedEntityDataValue' AS datatype,
       CONCAT(
            'Organisation Unit: ', COALESCE(ou_psi.name, ou_psi.uid, ''), E'\n',
            'Event: ', COALESCE(psi.uid, ''), E'\n',
            CASE WHEN tedva.dataelementid IS NOT NULL
                THEN CONCAT('Data Element: ', COALESCE(de2.name, de2.uid, ''), E'\n')
                ELSE CONCAT('Event Field: ', COALESCE(tedva.eventfield, ''), E'\n')
            END,
            'Previous Value: ', COALESCE(tedva.previousvalue, ''), E'\n',
            CASE
                WHEN p.type = 'WITH_REGISTRATION' THEN
                    CONCAT(
                        E'\n',
                        'Program: ', COALESCE(p.name, p.uid, ''), E'\n',
                        'Program Stage: ', COALESCE(ps2.name, ps2.uid, '')
                    )
                ELSE CONCAT(E'\n', 'Program: ', COALESCE(p.name, p.uid, ''))
            END
       ) AS related
    FROM trackereventchangelog tedva
    LEFT JOIN trackerevent psi ON tedva.eventid = psi.eventid
    LEFT JOIN organisationunit ou_psi ON psi.organisationunitid = ou_psi.organisationunitid
    LEFT JOIN dataelement de2 ON tedva.dataelementid = de2.dataelementid
    LEFT JOIN programstage ps2 ON psi.programstageid = ps2.programstageid
    LEFT JOIN program p ON ps2.programid = p.programid
    WHERE tedva.created >= '${startDate}'::date
      AND tedva.created < ('${endDate}'::date + INTERVAL '1 day')
      AND (
        '${username}' = 'ALL' OR
        MD5(tedva.createdby) = '${username}'
      )
      AND (
        '${dataType}' = 'ALL' OR
        '${dataType}' = 'trackedEntityDataValue'
      )
      AND (
        '${excludedProgramId}' = 'ANY' OR
        p.uid != '${excludedProgramId}'
      )
      AND (
        '${programId}' = 'ALL' OR
        p.uid = '${programId}'
      )
      AND (
        '${excludedUser}' = 'ANY' OR
        MD5(tedva.createdby) != '${excludedUser}'
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        CASE '${includeDescendants}'
            WHEN 'true' THEN
                ou_psi.path IS NOT NULL AND EXISTS (
                    SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
                    WHERE ou_psi.path LIKE '%/' || trim(t.uid) || '/%' OR ou_psi.path LIKE '%/' || trim(t.uid)
                )
            ELSE
                ou_psi.uid = ANY(string_to_array('${orgUnitIds}', '_'))
        END
      )

    UNION ALL

    SELECT
       tedva.created,
       tedva.createdby AS modifiedby,
       tedva.changelogtype AS audittype,
       COALESCE(tedva.currentvalue, tedva.previousvalue) AS value,
       'trackedEntityDataValue' AS datatype,
       CONCAT(
            'Organisation Unit: ', COALESCE(ou_psi.name, ou_psi.uid, ''), E'\n',
            'Event: ', COALESCE(psi.uid, ''), E'\n',
            CASE WHEN tedva.dataelementid IS NOT NULL
                THEN CONCAT('Data Element: ', COALESCE(de2.name, de2.uid, ''), E'\n')
                ELSE CONCAT('Event Field: ', COALESCE(tedva.eventfield, ''), E'\n')
            END,
            'Previous Value: ', COALESCE(tedva.previousvalue, ''), E'\n',
            CASE
                WHEN p.type = 'WITH_REGISTRATION' THEN
                    CONCAT(
                        E'\n',
                        'Program: ', COALESCE(p.name, p.uid, ''), E'\n',
                        'Program Stage: ', COALESCE(ps2.name, ps2.uid, '')
                    )
                ELSE CONCAT(E'\n', 'Program: ', COALESCE(p.name, p.uid, ''))
            END
       ) AS related
    FROM singleeventchangelog tedva
    LEFT JOIN singleevent psi ON tedva.eventid = psi.eventid
    LEFT JOIN organisationunit ou_psi ON psi.organisationunitid = ou_psi.organisationunitid
    LEFT JOIN dataelement de2 ON tedva.dataelementid = de2.dataelementid
    LEFT JOIN programstage ps2 ON psi.programstageid = ps2.programstageid
    LEFT JOIN program p ON ps2.programid = p.programid
    WHERE tedva.created >= '${startDate}'::date
      AND tedva.created < ('${endDate}'::date + INTERVAL '1 day')
      AND (
        '${username}' = 'ALL' OR
        MD5(tedva.createdby) = '${username}'
      )
      AND (
        '${dataType}' = 'ALL' OR
        '${dataType}' = 'trackedEntityDataValue'
      )
      AND (
        '${excludedProgramId}' = 'ANY' OR
        p.uid != '${excludedProgramId}'
      )
      AND (
        '${programId}' = 'ALL' OR
        p.uid = '${programId}'
      )
      AND (
        '${excludedUser}' = 'ANY' OR
        MD5(tedva.createdby) != '${excludedUser}'
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        CASE '${includeDescendants}'
            WHEN 'true' THEN
                ou_psi.path IS NOT NULL AND EXISTS (
                    SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
                    WHERE ou_psi.path LIKE '%/' || trim(t.uid) || '/%' OR ou_psi.path LIKE '%/' || trim(t.uid)
                )
            ELSE
                ou_psi.uid = ANY(string_to_array('${orgUnitIds}', '_'))
        END
      )

    UNION ALL

    SELECT
       teava.created,
       teava.createdby AS modifiedby,
       teava.changelogtype AS audittype,
       COALESCE(teava.currentvalue, teava.previousvalue) AS value,
       'trackedEntityAttributeValue' AS datatype,
       CONCAT(
            'Organisation Unit: ', COALESCE(ou_tei.name, ou_tei.uid, ''), E'\n',
            'Tracked Entity Instance: ', COALESCE(tei.uid, ''), E'\n',
            'Attribute: ', COALESCE(tea.name, tea.uid, ''), E'\n',
            'Previous Value: ', COALESCE(teava.previousvalue, '')
       ) AS related
    FROM trackedentitychangelog teava
    LEFT JOIN trackedentity tei ON teava.trackedentityid = tei.trackedentityid
    LEFT JOIN organisationunit ou_tei ON tei.organisationunitid = ou_tei.organisationunitid
    LEFT JOIN trackedentityattribute tea ON teava.trackedentityattributeid = tea.trackedentityattributeid
    WHERE teava.created >= '${startDate}'::date
      AND teava.created < ('${endDate}'::date + INTERVAL '1 day')
      AND (
        '${username}' = 'ALL' OR
        MD5(teava.createdby) = '${username}'
      )
      AND (
        '${dataType}' = 'ALL' OR
        '${dataType}' = 'trackedEntityAttributeValue'
      )
      AND (
        '${excludedProgramId}' = 'ANY' OR
        NOT EXISTS (
            SELECT 1
            FROM enrollment pi
            JOIN program p2 ON p2.programid = pi.programid
            WHERE pi.trackedentityid = teava.trackedentityid
              AND p2.uid = '${excludedProgramId}'
        )
      )
      AND (
        '${programId}' = 'ALL' OR
        EXISTS (
            SELECT 1
            FROM enrollment pi2
            JOIN program p3 ON p3.programid = pi2.programid
            WHERE pi2.trackedentityid = teava.trackedentityid
              AND p3.uid = '${programId}'
        )
      )
      AND (
        '${excludedUser}' = 'ANY' OR
        MD5(teava.createdby) != '${excludedUser}'
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        CASE '${includeDescendants}'
            WHEN 'true' THEN
                ou_tei.path IS NOT NULL AND EXISTS (
                    SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
                    WHERE ou_tei.path LIKE '%/' || trim(t.uid) || '/%' OR ou_tei.path LIKE '%/' || trim(t.uid)
                )
            ELSE
                ou_tei.uid = ANY(string_to_array('${orgUnitIds}', '_'))
        END
      )

    UNION ALL

    SELECT
       teia.created,
       teia.accessedby AS modifiedby,
       teia.audittype,
       teia.comment AS value,
       'trackedEntityInstance' AS datatype,
       CONCAT(
            'Organisation Unit: ', COALESCE(ou_teia.name, ou_teia.uid, ''), E'\n',
            'Tracked Entity Instance: ', COALESCE(teia.trackedentity, '')
       ) AS related
    FROM trackedentityaudit teia
    LEFT JOIN trackedentity tei_ou ON tei_ou.uid = teia.trackedentity
    LEFT JOIN organisationunit ou_teia ON tei_ou.organisationunitid = ou_teia.organisationunitid
    WHERE teia.created >= '${startDate}'::date
      AND teia.created < ('${endDate}'::date + INTERVAL '1 day')
      AND (
        '${username}' = 'ALL' OR
        MD5(teia.accessedby) = '${username}'
      )
      AND (
        '${dataType}' = 'ALL' OR
        '${dataType}' = 'trackedEntityInstance'
      )
      AND (
        '${excludedUser}' = 'ANY' OR
        MD5(teia.accessedby) != '${excludedUser}'
      )
      AND (
        '${excludedProgramId}' = 'ANY' OR
        NOT EXISTS (
            SELECT 1
            FROM trackedentity tei_audit
            JOIN enrollment pi ON pi.trackedentityid = tei_audit.trackedentityid
            JOIN program p2 ON p2.programid = pi.programid
            WHERE tei_audit.uid = teia.trackedentity
              AND p2.uid = '${excludedProgramId}'
        )
      )
      AND (
        '${programId}' = 'ALL' OR
        EXISTS (
            SELECT 1
            FROM trackedentity tei_audit2
            JOIN enrollment pi3 ON pi3.trackedentityid = tei_audit2.trackedentityid
            JOIN program p4 ON p4.programid = pi3.programid
            WHERE tei_audit2.uid = teia.trackedentity
              AND p4.uid = '${programId}'
        )
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        CASE '${includeDescendants}'
            WHEN 'true' THEN
                ou_teia.path IS NOT NULL AND EXISTS (
                    SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
                    WHERE ou_teia.path LIKE '%/' || trim(t.uid) || '/%' OR ou_teia.path LIKE '%/' || trim(t.uid)
                )
            ELSE
                ou_teia.uid = ANY(string_to_array('${orgUnitIds}', '_'))
        END
      )
)

SELECT
    to_char(created, 'YYYY-MM-DD HH24:MI:SS') AS created,
    modifiedby,
    audittype,
    value,
    datatype,
    related
FROM unioned
ORDER BY created DESC
LIMIT ${pageSize}
OFFSET ${offset}
