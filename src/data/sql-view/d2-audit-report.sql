SELECT 
    dva.created,
    dva.modifiedby,
    dva.audittype,
    dva.value,
    ps.iso as period,
    ou.uid as organisationunit_id,
    ou.name as organisationunit_name,
    de.uid as dataelement_id,
    de.name as dataelement_name,
    aoc.uid as attributeoptioncombo_id,
    aoc.name as attributeoptioncombo_name,
    coc.uid as categoryoptioncombo_id,
    coc.name as categoryoptioncombo_name
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


