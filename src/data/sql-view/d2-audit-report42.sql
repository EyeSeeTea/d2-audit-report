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
    LEFT JOIN analytics_rs_periodstructure ps ON dva.periodid = ps.periodid
    LEFT JOIN organisationunit ou ON dva.organisationunitid = ou.organisationunitid
    LEFT JOIN dataelement de ON dva.dataelementid = de.dataelementid
    LEFT JOIN datasetelement dse ON de.dataelementid = dva.dataelementid
    LEFT JOIN dataset ds ON dse.datasetid = ds.datasetid
    LEFT JOIN categoryoptioncombo aoc ON dva.attributeoptioncomboid = aoc.categoryoptioncomboid
    LEFT JOIN categoryoptioncombo coc ON dva.categoryoptioncomboid = coc.categoryoptioncomboid
    WHERE dva.created >= '${startDate}'::date
      AND dva.created < ('${endDate}'::date + INTERVAL '1 day')
      AND ('${username}' = 'ALL' OR MD5(dva.modifiedby) = '${username}')
      AND ('${dataType}' = 'ALL' OR '${dataType}' = 'dataValue')

    UNION ALL

    SELECT 
       ecl.created,
       ecl.createdby AS modifiedby,
       ecl.changelogtype AS audittype,
       COALESCE(ecl.currentvalue, ecl.previousvalue, '') AS value,
       'trackedEntityDataValue' AS datatype,
       CONCAT(
            'Event: ', COALESCE(ev.uid, ''), E'\n',
            'Data Element: ', COALESCE(de2.name, de2.uid, ''), E'\n',
            'Event Field: ', COALESCE(ecl.eventfield, ''), E'\n',
            'Previous Value: ', COALESCE(ecl.previousvalue, ''), E'\n',
            'Program: ', COALESCE(p.name, p.uid, ''), E'\n',
            'Program Stage: ', COALESCE(ps2.name, ps2.uid, '')
       ) AS related
    FROM eventchangelog ecl
    LEFT JOIN event ev ON ecl.eventid = ev.eventid
    LEFT JOIN dataelement de2 ON ecl.dataelementid = de2.dataelementid
    LEFT JOIN programstage ps2 ON ev.programstageid = ps2.programstageid
    LEFT JOIN program p ON ps2.programid = p.programid
    WHERE ecl.created >= '${startDate}'::date
      AND ecl.created < ('${endDate}'::date + INTERVAL '1 day')
      AND ('${username}' = 'ALL' OR MD5(ecl.createdby) = '${username}')
      AND ('${dataType}' = 'ALL' OR '${dataType}' = 'trackedEntityDataValue')

    UNION ALL

    SELECT 
       tecl.created,
       tecl.createdby AS modifiedby,
       tecl.changelogtype AS audittype,
       COALESCE(tecl.currentvalue, tecl.previousvalue, '') AS value,
       'trackedEntityAttributeValue' AS datatype,
       CONCAT(
            'Tracked Entity: ', COALESCE(te.uid, ''), E'\n',
            'Attribute: ', COALESCE(tea.name, tea.uid, ''), E'\n',
            'Previous Value: ', COALESCE(tecl.previousvalue, '')
       ) AS related
    FROM trackedentitychangelog tecl
    LEFT JOIN trackedentity te ON tecl.trackedentityid = te.trackedentityid
    LEFT JOIN trackedentityattribute tea ON tecl.trackedentityattributeid = tea.trackedentityattributeid
    WHERE tecl.created >= '${startDate}'::date
      AND tecl.created < ('${endDate}'::date + INTERVAL '1 day')
      AND ('${username}' = 'ALL' OR MD5(tecl.createdby) = '${username}')
      AND ('${dataType}' = 'ALL' OR '${dataType}' = 'trackedEntityAttributeValue')

    UNION ALL

    
    SELECT 
       tea.created,
       tea.accessedby AS modifiedby,
       tea.audittype,
       tea.comment AS value,
       'trackedEntityInstance' AS datatype,
       CONCAT(
            'Tracked Entity: ', COALESCE(tea.trackedentity, '')
       ) AS related
    FROM trackedentityaudit tea
    WHERE tea.created >= '${startDate}'::date
      AND tea.created < ('${endDate}'::date + INTERVAL '1 day')
      AND ('${username}' = 'ALL' OR MD5(tea.accessedby) = '${username}')
      AND ('${dataType}' = 'ALL' OR '${dataType}' = 'trackedEntityInstance')
)
SELECT *
FROM unioned
ORDER BY created DESC
LIMIT ${pageSize}
OFFSET ${offset}
