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

