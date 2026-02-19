WITH unioned AS (
    SELECT 
        dva.created,
        dva.modifiedby,
        dva.audittype,
        dva.value,
        'dataValue' AS datatype,
        CONCAT(
            'Period: ', COALESCE(ps.iso, ''), E'\n',
            'Organisation Unit: ', COALESCE(ou.name, ou.uid, ''), E'\n',
            'Data Element: ', COALESCE(de.name, de.uid, ''), E'\n',
            'Data Set: ', COALESCE(ds.name, ds.uid, ''), E'\n',
            'Attribute Option Combo: ', COALESCE(aoc.name, aoc.uid, ''), E'\n',
            'Category Option Combo: ', COALESCE(coc.name, coc.uid, '')
        ) AS related
    FROM datavalueaudit dva
    LEFT JOIN _periodstructure ps ON dva.periodid = ps.periodid
    LEFT JOIN organisationunit ou ON dva.organisationunitid = ou.organisationunitid
    LEFT JOIN dataelement de ON dva.dataelementid = de.dataelementid
    LEFT JOIN datasetelement dse ON de.dataelementid = dva.dataelementid
    LEFT JOIN dataset ds ON dse.datasetid = ds.datasetid
    LEFT JOIN categoryoptioncombo aoc ON dva.attributeoptioncomboid = aoc.categoryoptioncomboid
    LEFT JOIN categoryoptioncombo coc ON dva.categoryoptioncomboid = coc.categoryoptioncomboid
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
        (ou.path IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
            WHERE ou.path LIKE '%/' || trim(t.uid) || '/%' OR ou.path LIKE '%/' || trim(t.uid)
        ))
      )

    UNION ALL

    SELECT 
       tedva.created,
       tedva.modifiedby,
       tedva.audittype,
       tedva.value,
       'trackedEntityDataValue' AS datatype,
       CONCAT(
            'Event: ', COALESCE(psi.uid, ''), E'\n',
            'Data Element: ', COALESCE(de2.name, de2.uid, ''), E'\n',
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
    FROM trackedentitydatavalueaudit tedva
    LEFT JOIN programstageinstance psi ON tedva.programstageinstanceid = psi.programstageinstanceid
    LEFT JOIN organisationunit ou_psi ON psi.organisationunitid = ou_psi.organisationunitid
    LEFT JOIN dataelement de2 ON tedva.dataelementid = de2.dataelementid
    LEFT JOIN programstage ps2 ON psi.programstageid = ps2.programstageid
    LEFT JOIN program p ON ps2.programid = p.programid
    WHERE tedva.created >= '${startDate}'::date
      AND tedva.created < ('${endDate}'::date + INTERVAL '1 day')
      AND (
        '${username}' = 'ALL' OR 
        MD5(tedva.modifiedby) = '${username}'
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
        '${excludedUser}' = 'ANY' OR
        MD5(tedva.modifiedby) != '${excludedUser}'
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        (ou_psi.path IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
            WHERE ou_psi.path LIKE '%/' || trim(t.uid) || '/%' OR ou_psi.path LIKE '%/' || trim(t.uid)
        ))
      )

    UNION ALL

    SELECT 
       teava.created,
       teava.modifiedby,
       teava.audittype,
       teava.value,
       'trackedEntityAttributeValue' AS datatype,
       CONCAT(
            'Tracked Entity Instance: ', COALESCE(tei.uid, ''), E'\n',
            'Attribute: ', COALESCE(tea.name, tea.uid, '')
       ) AS related
    FROM trackedentityattributevalueaudit teava
    LEFT JOIN trackedentityinstance tei ON teava.trackedentityinstanceid = tei.trackedentityinstanceid
    LEFT JOIN organisationunit ou_tei ON tei.organisationunitid = ou_tei.organisationunitid
    LEFT JOIN trackedentityattribute tea ON teava.trackedentityattributeid = tea.trackedentityattributeid
    WHERE teava.created >= '${startDate}'::date
      AND teava.created < ('${endDate}'::date + INTERVAL '1 day')
      AND (
        '${username}' = 'ALL' OR 
        MD5(teava.modifiedby) = '${username}'
      )
      AND (
        '${dataType}' = 'ALL' OR 
        '${dataType}' = 'trackedEntityAttributeValue'
      )
      AND (
        '${excludedProgramId}' = 'ANY' OR
        NOT EXISTS (
            SELECT 1
            FROM programinstance pi
            JOIN program p2 ON p2.programid = pi.programid
            WHERE pi.trackedentityinstanceid = teava.trackedentityinstanceid
              AND p2.uid = '${excludedProgramId}'
        )
      )
      AND (
        '${excludedUser}' = 'ANY' OR
        MD5(teava.modifiedby) != '${excludedUser}'
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        (ou_tei.path IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
            WHERE ou_tei.path LIKE '%/' || trim(t.uid) || '/%' OR ou_tei.path LIKE '%/' || trim(t.uid)
        ))
      )

    UNION ALL

    SELECT 
       teia.created,
       teia.accessedby AS modifiedby,
       teia.audittype,
       teia.comment AS value,
       'trackedEntityInstance' AS datatype,
       CONCAT(
            'Tracked Entity Instance: ', COALESCE(teia.trackedentityinstance, '')
       ) AS related
    FROM trackedentityinstanceaudit teia
    LEFT JOIN trackedentityinstance tei_ou ON tei_ou.uid = teia.trackedentityinstance
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
            FROM trackedentityinstance tei_audit
            JOIN programinstance pi ON pi.trackedentityinstanceid = tei_audit.trackedentityinstanceid
            JOIN program p2 ON p2.programid = pi.programid
            WHERE tei_audit.uid = teia.trackedentityinstance
              AND p2.uid = '${excludedProgramId}'
        )
      )
      AND (
        '${orgUnitIds}' = 'ALL' OR
        (ou_teia.path IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(string_to_array('${orgUnitIds}', '_')) AS t(uid)
            WHERE ou_teia.path LIKE '%/' || trim(t.uid) || '/%' OR ou_teia.path LIKE '%/' || trim(t.uid)
        ))
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