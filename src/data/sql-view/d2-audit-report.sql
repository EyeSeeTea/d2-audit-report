SELECT 
    dva.created,
    dva.modifiedby,
    dva.audittype,
    dva.value,
    'dataValue' as datatype,
    CONCAT(
        'Period: ', COALESCE(ps.iso, ''), E'\n',
        'Organisation Unit: ', COALESCE(ou.name, ou.uid, ''), E'\n',
        'Data Element: ', COALESCE(de.name, de.uid, ''), E'\n',
        'Attribute Option Combo: ', COALESCE(aoc.name, aoc.uid, ''), E'\n',
        'Category Option Combo: ', COALESCE(coc.name, coc.uid, '')
    ) as related
FROM datavalueaudit dva
LEFT JOIN _periodstructure ps ON dva.periodid = ps.periodid
LEFT JOIN organisationunit ou ON dva.organisationunitid = ou.organisationunitid
LEFT JOIN dataelement de ON dva.dataelementid = de.dataelementid
LEFT JOIN categoryoptioncombo aoc ON dva.attributeoptioncomboid = aoc.categoryoptioncomboid
LEFT JOIN categoryoptioncombo coc ON dva.categoryoptioncomboid = coc.categoryoptioncomboid
WHERE 1=1
    AND dva.created::date >= '${startDate}'
    AND dva.created::date <= '${endDate}'
ORDER BY dva.created DESC
LIMIT ${pageSize}
OFFSET ${offset}


