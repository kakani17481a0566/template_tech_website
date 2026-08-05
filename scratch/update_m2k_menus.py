import re
import os

files = [
    'm2k.html',
    'm2k-about-us.html',
    'm2k-the-mission.html',
    'm2k-ece-day.html',
    'm2k-join-the-movement.html',
    'm2k-stories.html'
]

menu_data_json = '{"primary_nav":[' \
'{"ID":1002,"title":"About","url":"m2k-about-us.html","menu_item_parent":"0","active":false,"alternate_label":"","target":""},' \
'{"ID":2050,"title":"About Us","url":"m2k-about-us.html","menu_item_parent":"1002","active":false,"alternate_label":"","target":""},' \
'{"ID":2001,"title":"Why Early Years Matter?","url":"m2k-about-us.html#why-early-years-matter","menu_item_parent":"1002","active":false,"alternate_label":"","target":""},' \
'{"ID":2002,"title":"India\'s Educational Legacy","url":"m2k-about-us.html#indias-educational-legacy","menu_item_parent":"1002","active":false,"alternate_label":"","target":""},' \
'{"ID":2003,"title":"Welcome from the Founding Enablers","url":"m2k-about-us.html#welcome-from-the-founding-enablers","menu_item_parent":"1002","active":false,"alternate_label":"","target":""},' \
'{"ID":2004,"title":"Governance & Policies","url":"m2k-about-us.html#governance-and-policies","menu_item_parent":"1002","active":false,"alternate_label":"","target":""},' \
'{"ID":1003,"title":"The Mission","url":"m2k-the-mission.html","menu_item_parent":"0","active":false,"alternate_label":"","target":""},' \
'{"ID":2005,"title":"Our Mission","url":"m2k-the-mission.html#our-mission","menu_item_parent":"1003","active":false,"alternate_label":"","target":""},' \
'{"ID":2006,"title":"Our Core Values","url":"m2k-the-mission.html#our-core-values","menu_item_parent":"1003","active":false,"alternate_label":"","target":""},' \
'{"ID":2007,"title":"Our Guiding Beliefs","url":"m2k-the-mission.html#our-guiding-beliefs","menu_item_parent":"1003","active":false,"alternate_label":"","target":""},' \
'{"ID":2008,"title":"Our Promise","url":"m2k-the-mission.html#our-promise","menu_item_parent":"1003","active":false,"alternate_label":"","target":""},' \
'{"ID":1004,"title":"National ECE Day","url":"m2k-ece-day.html","menu_item_parent":"0","active":false,"alternate_label":"","target":""},' \
'{"ID":2009,"title":"Why 10 August?","url":"m2k-ece-day.html#why-10-august","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":2010,"title":"Why Early Childhood Education Matters","url":"m2k-ece-day.html#why-early-childhood-education-matters","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":2011,"title":"Objectives of National Early Childhood Education Day","url":"m2k-ece-day.html#objectives-of-national-early-childhood-education-day","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":2012,"title":"Who We Celebrate","url":"m2k-ece-day.html#who-we-celebrate","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":2013,"title":"How India Can Participate","url":"m2k-ece-day.html#how-india-can-participate","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":2014,"title":"National Early Childhood Education Pledge","url":"m2k-ece-day.html#national-early-childhood-education-pledge","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":2015,"title":"A Day of Celebration. A Lifetime of Impact","url":"m2k-ece-day.html#a-day-of-celebration","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":2016,"title":"Our Call to the Nation","url":"m2k-ece-day.html#our-call-to-the-nation","menu_item_parent":"1004","active":false,"alternate_label":"","target":""},' \
'{"ID":1005,"title":"Join the Movement","url":"m2k-join-the-movement.html","menu_item_parent":"0","active":false,"alternate_label":"","target":""},' \
'{"ID":2045,"title":"Who Can Join?","url":"m2k-join-the-movement.html#who-can-join","menu_item_parent":"1005","active":false,"alternate_label":"","target":""},' \
'{"ID":2017,"title":"How You Can Contribute","url":"#","menu_item_parent":"1005","active":false,"alternate_label":"","target":""},' \
'{"ID":1006,"title":"For Schools","url":"#","menu_item_parent":"2017","active":false,"alternate_label":"","target":""},' \
'{"ID":2046,"title":"Our Theme for 2026","url":"m2k-join-the-movement.html#for-schools","menu_item_parent":"1006","active":false,"alternate_label":"","target":""},' \
'{"ID":2018,"title":"Our Commitments","url":"m2k-join-the-movement.html#for-schools","menu_item_parent":"1006","active":false,"alternate_label":"","target":""},' \
'{"ID":2019,"title":"Our Partnership with Families","url":"m2k-join-the-movement.html#for-schools","menu_item_parent":"1006","active":false,"alternate_label":"","target":""},' \
'{"ID":2020,"title":"Our Promise to Every Child","url":"m2k-join-the-movement.html#for-schools","menu_item_parent":"1006","active":false,"alternate_label":"","target":""},' \
'{"ID":2021,"title":"Our Vision Beyond the Classroom","url":"m2k-join-the-movement.html#for-schools","menu_item_parent":"1006","active":false,"alternate_label":"","target":""},' \
'{"ID":2022,"title":"Our School Pledge","url":"m2k-join-the-movement.html#for-schools","menu_item_parent":"1006","active":false,"alternate_label":"","target":""},' \
'{"ID":1007,"title":"For Teachers","url":"#","menu_item_parent":"2017","active":false,"alternate_label":"","target":""},' \
'{"ID":2047,"title":"A Commitment to Transform Lives","url":"m2k-join-the-movement.html#for-teachers","menu_item_parent":"1007","active":false,"alternate_label":"","target":""},' \
'{"ID":2023,"title":"Our Professional Commitments","url":"m2k-join-the-movement.html#for-teachers","menu_item_parent":"1007","active":false,"alternate_label":"","target":""},' \
'{"ID":2024,"title":"The Mission 2026 Teacher Pledge","url":"m2k-join-the-movement.html#for-teachers","menu_item_parent":"1007","active":false,"alternate_label":"","target":""},' \
'{"ID":1008,"title":"For Parents","url":"#","menu_item_parent":"2017","active":false,"alternate_label":"","target":""},' \
'{"ID":2048,"title":"A Partnership for Every Child\'s Future","url":"m2k-join-the-movement.html#how-can-you-contribute","menu_item_parent":"1008","active":false,"alternate_label":"","target":""},' \
'{"ID":2025,"title":"Our Shared Mission","url":"m2k-join-the-movement.html#how-can-you-contribute","menu_item_parent":"1008","active":false,"alternate_label":"","target":""},' \
'{"ID":2026,"title":"Our Partnership","url":"m2k-join-the-movement.html#how-can-you-contribute","menu_item_parent":"1008","active":false,"alternate_label":"","target":""},' \
'{"ID":2027,"title":"Our Promise to Our Children","url":"m2k-join-the-movement.html#how-can-you-contribute","menu_item_parent":"1008","active":false,"alternate_label":"","target":""},' \
'{"ID":2028,"title":"The Mission 2026 Parent Pledge","url":"m2k-join-the-movement.html#how-can-you-contribute","menu_item_parent":"1008","active":false,"alternate_label":"","target":""},' \
'{"ID":2029,"title":"Together We Build the Future","url":"m2k-join-the-movement.html#how-can-you-contribute","menu_item_parent":"1008","active":false,"alternate_label":"","target":""},' \
'{"ID":1009,"title":"Partners","url":"#","menu_item_parent":"2017","active":false,"alternate_label":"","target":""},' \
'{"ID":2049,"title":"An Invitation to Partner in Nation Building","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":2030,"title":"Why Partner with Mission 2026?","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":2031,"title":"Our Partnership Principles","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":2033,"title":"Our Commitment to Partners","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":2034,"title":"A Shared Legacy","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":2035,"title":"The Mission 2000 Pledge","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":2036,"title":"Together We Can Transform the Future","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":2037,"title":"Join Us","url":"m2k-join-the-movement.html#for-partners","menu_item_parent":"1009","active":false,"alternate_label":"","target":""},' \
'{"ID":1010,"title":"Stories","url":"m2k-stories.html","menu_item_parent":"0","active":false,"alternate_label":"","target":""},' \
'{"ID":2038,"title":"Children\'s Stories","url":"m2k-stories.html#stories-of-hope-2","menu_item_parent":"1010","active":false,"alternate_label":"","target":""},' \
'{"ID":2039,"title":"Parents\' Stories","url":"m2k-stories.html#stories-of-hope-1","menu_item_parent":"1010","active":false,"alternate_label":"","target":""},' \
'{"ID":2040,"title":"Healthcare Heroes","url":"m2k-stories.html#caring-hearts-healthier-beginnings","menu_item_parent":"1010","active":false,"alternate_label":"","target":""},' \
'{"ID":2041,"title":"School Stories","url":"m2k-stories.html#stories-of-hope-3","menu_item_parent":"1010","active":false,"alternate_label":"","target":""},' \
'{"ID":2042,"title":"Research into Practice","url":"m2k-stories.html#science-inspiring-everyday-action","menu_item_parent":"1010","active":false,"alternate_label":"","target":""},' \
'{"ID":2043,"title":"Voices of India","url":"m2k-stories.html#one-nation-one-voice","menu_item_parent":"1010","active":false,"alternate_label":"","target":""},' \
'{"ID":1011,"title":"Contact","url":"#","menu_item_parent":"0","active":false,"alternate_label":"","target":""},' \
'{"ID":2044,"title":"Founder Enablers","url":"#","menu_item_parent":"1011","active":false,"alternate_label":"","target":""},' \
'{"ID":2051,"title":"Prasad Garapati","url":"Prasad.html","menu_item_parent":"2044","active":false,"alternate_label":"","target":""},' \
'{"ID":2052,"title":"Dr Aperna Volluru","url":"Aperna.html","menu_item_parent":"2044","active":false,"alternate_label":"","target":""},' \
'{"ID":2053,"title":"MNR Gupta","url":"Gupta.html","menu_item_parent":"2044","active":false,"alternate_label":"","target":""}' \
']}'

header_nav_html = '''<div id="menu">
                    <nav role="navigation" aria-label="primary">
                        <ul>
                            <li class="first-level-item menu-theme-green has-children"><a tabindex="0" href="m2k-about-us.html"
                                    class=""><span class="icon"></span> <span class="">About</span></a>
                                <ul class="child">
                                    <li><a tabindex="0" href="m2k-about-us.html"><span>About Us</span></a></li>
                                    <li><a tabindex="0" href="m2k-about-us.html#why-early-years-matter"><span>Why Early Years Matter?</span></a></li>
                                    <li><a tabindex="0" href="m2k-about-us.html#indias-educational-legacy"><span>India's Educational Legacy</span></a></li>
                                    <li><a tabindex="0" href="m2k-about-us.html#welcome-from-the-founding-enablers"><span>Welcome from the Founding Enablers</span></a>
                                    </li>
                                    <li><a tabindex="0" href="m2k-about-us.html#governance-and-policies"><span>Governance &amp; Policies</span></a></li>
                                </ul>
                            </li>
                            <li class="first-level-item menu-theme-pink has-children"><a tabindex="0" href="m2k-the-mission.html"
                                    class=""><span class="icon"></span> <span class="">The Mission</span></a>
                                <ul class="child">
                                    <li><a tabindex="0" href="m2k-the-mission.html#our-mission"><span>Our Mission</span></a></li>
                                    <li><a tabindex="0" href="m2k-the-mission.html#our-core-values"><span>Our Core Values</span></a></li>
                                    <li><a tabindex="0" href="m2k-the-mission.html#our-guiding-beliefs"><span>Our Guiding Beliefs</span></a></li>
                                    <li><a tabindex="0" href="m2k-the-mission.html#our-promise"><span>Our Promise</span></a></li>
                                </ul>
                            </li>
                            <li class="first-level-item menu-theme-yellow has-children"><a tabindex="0" href="m2k-ece-day.html"
                                    class=""><span class="icon"></span> <span class="">National ECE Day</span></a>
                                <ul class="child">
                                    <li><a tabindex="0" href="m2k-ece-day.html#why-10-august"><span>Why 10 August?</span></a></li>
                                    <li><a tabindex="0" href="m2k-ece-day.html#why-early-childhood-education-matters"><span>Why Early Childhood Education Matters</span></a>
                                    </li>
                                    <li><a tabindex="0" href="m2k-ece-day.html#objectives-of-national-early-childhood-education-day"><span>Objectives of National Early Childhood Education
                                                Day</span></a></li>
                                    <li><a tabindex="0" href="m2k-ece-day.html#who-we-celebrate"><span>Who We Celebrate</span></a></li>
                                    <li><a tabindex="0" href="m2k-ece-day.html#how-india-can-participate"><span>How India Can Participate</span></a></li>
                                    <li><a tabindex="0" href="m2k-ece-day.html#national-early-childhood-education-pledge"><span>National Early Childhood Education
                                                Pledge</span></a></li>
                                    <li><a tabindex="0" href="m2k-ece-day.html#a-day-of-celebration"><span>A Day of Celebration. A Lifetime of
                                                Impact</span></a></li>
                                    <li><a tabindex="0" href="m2k-ece-day.html#our-call-to-the-nation"><span>Our Call to the Nation</span></a></li>
                                </ul>
                            </li>
                            <li class="first-level-item menu-theme-orange has-children"><a tabindex="0" href="m2k-join-the-movement.html"
                                    class=""><span class="icon"></span> <span class="">Join the Movement</span></a>
                                <ul class="child">
                                    <li><a tabindex="0" href="m2k-join-the-movement.html#who-can-join"><span>Who Can Join?</span></a></li>
                                    <li class="menu-item-accordion">
                                        <input type="checkbox" id="nav-accordion-contribute" class="accordion-checkbox">
                                        <label for="nav-accordion-contribute" class="accordion-toggle"><span>How You Can Contribute</span><span class="accordion-chevron"></span></label>
                                        <ul class="grandchild accordion-panel">
                                            <!-- For Schools sub-accordion -->
                                            <li class="menu-item-sub-accordion">
                                                <input type="checkbox" id="nav-sub-schools" class="sub-accordion-checkbox">
                                                <label for="nav-sub-schools" class="sub-accordion-toggle"><span>For Schools</span><span class="sub-accordion-chevron"></span></label>
                                                <ul class="sub-accordion-panel">
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-schools"><span>Our Theme for 2026</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-schools"><span>Our Commitments</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-schools"><span>Our Partnership with Families</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-schools"><span>Our Promise to Every Child</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-schools"><span>Our Vision Beyond the Classroom</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-schools"><span>Our School Pledge</span></a></li>
                                                </ul>
                                            </li>
                                            <!-- For Teachers sub-accordion -->
                                            <li class="menu-item-sub-accordion">
                                                <input type="checkbox" id="nav-sub-teachers" class="sub-accordion-checkbox">
                                                <label for="nav-sub-teachers" class="sub-accordion-toggle"><span>For Teachers</span><span class="sub-accordion-chevron"></span></label>
                                                <ul class="sub-accordion-panel">
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-teachers"><span>A Commitment to Transform Lives</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-teachers"><span>Our Professional Commitments</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-teachers"><span>The Mission 2026 Teacher Pledge</span></a></li>
                                                </ul>
                                            </li>
                                            <!-- For Parents sub-accordion -->
                                            <li class="menu-item-sub-accordion">
                                                <input type="checkbox" id="nav-sub-parents" class="sub-accordion-checkbox">
                                                <label for="nav-sub-parents" class="sub-accordion-toggle"><span>For Parents</span><span class="sub-accordion-chevron"></span></label>
                                                <ul class="sub-accordion-panel">
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#how-can-you-contribute"><span>A Partnership for Every Child's Future</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#how-can-you-contribute"><span>Our Shared Mission</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#how-can-you-contribute"><span>Our Partnership</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#how-can-you-contribute"><span>Our Promise to Our Children</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#how-can-you-contribute"><span>The Mission 2026 Parent Pledge</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#how-can-you-contribute"><span>Together We Build the Future</span></a></li>
                                                </ul>
                                            </li>
                                            <!-- Partners sub-accordion -->
                                            <li class="menu-item-sub-accordion">
                                                <input type="checkbox" id="nav-sub-partners" class="sub-accordion-checkbox">
                                                <label for="nav-sub-partners" class="sub-accordion-toggle"><span>Partners</span><span class="sub-accordion-chevron"></span></label>
                                                <ul class="sub-accordion-panel">
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>An Invitation to Partner in Nation Building</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>Why Partner with Mission 2026?</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>Our Partnership Principles</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>Our Commitment to Partners</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>A Shared Legacy</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>The Mission 2000 Pledge</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>Together We Can Transform the Future</span></a></li>
                                                    <li><a tabindex="0" href="m2k-join-the-movement.html#for-partners"><span>Join Us</span></a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li class="first-level-item menu-theme-orange has-children"><a tabindex="0" href="m2k-stories.html"
                                        class=""><span class="icon"></span> <span class="">Stories</span></a>
                                <ul class="child">
                                    <li><a tabindex="0" href="m2k-stories.html#stories-of-hope-2"><span>Children's Stories</span></a></li>
                                    <li><a tabindex="0" href="m2k-stories.html#stories-of-hope-1"><span>Parents' Stories</span></a></li>
                                    <li><a tabindex="0" href="m2k-stories.html#caring-hearts-healthier-beginnings"><span>Healthcare Heroes</span></a></li>
                                    <li><a tabindex="0" href="m2k-stories.html#stories-of-hope-3"><span>School Stories</span></a></li>
                                    <li><a tabindex="0" href="m2k-stories.html#science-inspiring-everyday-action"><span>Research into Practice</span></a></li>
                                    <li><a tabindex="0" href="m2k-stories.html#one-nation-one-voice"><span>Voices of India</span></a></li>
                                </ul>
                            </li>
                            <li class="first-level-item menu-theme-aqua has-children"><a tabindex="0" href="#"
                                    class=""><span class="icon"></span> <span class="">Contact</span></a>
                                <ul class="child">
                                    <li class="menu-item-accordion">
                                        <input type="checkbox" id="nav-accordion-founder-enablers" class="accordion-checkbox">
                                        <label for="nav-accordion-founder-enablers" class="accordion-toggle"><span>Founder Enablers</span><span class="accordion-chevron"></span></label>
                                        <ul class="grandchild accordion-panel">
                                            <li><a tabindex="0" href="Prasad.html"><span>Prasad Garapati</span></a></li>
                                            <li><a tabindex="0" href="Aperna.html"><span>Dr Aperna Volluru</span></a></li>
                                            <li><a tabindex="0" href="Gupta.html"><span>MNR Gupta</span></a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>'''

directory_menu_html = '''<ul id="menu-directory" class="menu">
                    <li class="menu-item menu-item-has-children menu-about menu-theme-orange"><a href="m2k-about-us.html">About</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-about-us"><a href="m2k-about-us.html">About Us</a></li>
                            <li class="menu-item menu-why-early-years-matter"><a href="m2k-about-us.html#why-early-years-matter">Why Early Years Matter?</a>
                            </li>
                            <li class="menu-item menu-india-s-educational-legacy"><a href="m2k-about-us.html#indias-educational-legacy">India's Educational
                                        Legacy</a></li>
                            <li class="menu-item menu-welcome-from-the-founding-enablers"><a href="m2k-about-us.html#welcome-from-the-founding-enablers">Welcome from the
                                        Founding Enablers</a></li>
                            <li class="menu-item menu-governance-policies"><a href="m2k-about-us.html#governance-and-policies">Governance &amp; Policies</a>
                            </li>
                        </ul>
                    </li>
                    <li class="menu-item menu-item-has-children menu-the-mission menu-theme-pink"><a href="m2k-the-mission.html">The
                            Mission</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-our-mission"><a href="m2k-the-mission.html#our-mission">Our Mission</a></li>
                            <li class="menu-item menu-our-core-values"><a href="m2k-the-mission.html#our-core-values">Our Core Values</a></li>
                            <li class="menu-item menu-our-guiding-beliefs"><a href="m2k-the-mission.html#our-guiding-beliefs">Our Guiding Beliefs</a></li>
                            <li class="menu-item menu-our-promise"><a href="m2k-the-mission.html#our-promise">Our Promise</a></li>
                        </ul>
                    </li>
                    <li class="menu-item menu-item-has-children menu-national-ecec-day menu-theme-yellow"><a
                            href="m2k-ece-day.html">National ECE Day</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-why-10-august"><a href="m2k-ece-day.html#why-10-august">Why 10 August?</a></li>
                            <li class="menu-item menu-why-early-childhood-education-matters"><a href="m2k-ece-day.html#why-early-childhood-education-matters">Why Early
                                    Childhood Education Matters</a></li>
                            <li class="menu-item menu-objectives-of-national-early-childhood-education-day"><a
                                    href="m2k-ece-day.html#objectives-of-national-early-childhood-education-day">Objectives of National Early Childhood Education Day</a></li>
                            <li class="menu-item menu-who-we-celebrate"><a href="m2k-ece-day.html#who-we-celebrate">Who We Celebrate</a></li>
                            <li class="menu-item menu-how-india-can-participate"><a href="m2k-ece-day.html#how-india-can-participate">How India Can
                                    Participate</a></li>
                            <li class="menu-item menu-national-early-childhood-education-pledge"><a href="m2k-ece-day.html#national-early-childhood-education-pledge">National
                                    Early Childhood Education Pledge</a></li>
                            <li class="menu-item menu-a-day-of-celebration-a-lifetime-of-impact"><a href="m2k-ece-day.html#a-day-of-celebration">A Day of Celebration. A Lifetime of
                                    Impact</a></li>
                            <li class="menu-item menu-our-call-to-the-nation"><a href="m2k-ece-day.html#our-call-to-the-nation">Our Call to the Nation</a></li>
                        </ul>
                    </li>
                    <li class="menu-item menu-item-has-children menu-join-the-movement menu-theme-orange"><a
                            href="m2k-join-the-movement.html">Join the Movement</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-who-can-join"><a href="m2k-join-the-movement.html#who-can-join">Who Can Join?</a></li>
                            <li class="menu-item menu-how-you-can-contribute menu-item-accordion">
                                <input type="checkbox" id="accordion-contribute" class="accordion-checkbox">
                                <label for="accordion-contribute" class="accordion-toggle"><span>How You Can Contribute</span><span class="accordion-chevron"></span></label>
                                <ul class="sub-menu accordion-panel">
                                    <li class="menu-item menu-item-accordion menu-for-schools">
                                        <input type="checkbox" id="accordion-schools" class="accordion-checkbox">
                                        <label for="accordion-schools" class="accordion-toggle"><span>For Schools</span><span class="accordion-chevron"></span></label>
                                        <ul class="sub-menu accordion-panel">
                                            <li class="menu-item menu-our-theme-for-2026"><a href="m2k-join-the-movement.html#for-schools">Our Theme for 2026</a></li>
                                            <li class="menu-item menu-our-commitments"><a href="m2k-join-the-movement.html#for-schools">Our Commitments</a></li>
                                            <li class="menu-item menu-our-partnership-with-families"><a href="m2k-join-the-movement.html#for-schools">Our Partnership with Families</a></li>
                                            <li class="menu-item menu-our-promise-to-every-child"><a href="m2k-join-the-movement.html#for-schools">Our Promise to Every Child</a></li>
                                            <li class="menu-item menu-our-vision-beyond-the-classroom"><a href="m2k-join-the-movement.html#for-schools">Our Vision Beyond the Classroom</a></li>
                                            <li class="menu-item menu-our-school-pledge"><a href="m2k-join-the-movement.html#for-schools">Our School Pledge</a></li>
                                        </ul>
                                    </li>
                                    <li class="menu-item menu-item-accordion menu-for-teachers">
                                        <input type="checkbox" id="accordion-teachers" class="accordion-checkbox">
                                        <label for="accordion-teachers" class="accordion-toggle"><span>For Teachers</span><span class="accordion-chevron"></span></label>
                                        <ul class="sub-menu accordion-panel">
                                            <li class="menu-item menu-a-commitment-to-transform-lives"><a href="m2k-join-the-movement.html#for-teachers">A Commitment to Transform Lives</a></li>
                                            <li class="menu-item menu-our-professional-commitments"><a href="m2k-join-the-movement.html#for-teachers">Our Professional Commitments</a></li>
                                            <li class="menu-item menu-the-mission-2026-teacher-pledge"><a href="m2k-join-the-movement.html#for-teachers">The Mission 2026 Teacher Pledge</a></li>
                                        </ul>
                                    </li>
                                    <li class="menu-item menu-item-accordion menu-for-parents">
                                        <input type="checkbox" id="accordion-parents" class="accordion-checkbox">
                                        <label for="accordion-parents" class="accordion-toggle"><span>For Parents</span><span class="accordion-chevron"></span></label>
                                        <ul class="sub-menu accordion-panel">
                                            <li class="menu-item menu-a-partnership-for-every-child-s-future"><a href="m2k-join-the-movement.html#how-can-you-contribute">A Partnership for Every Child's Future</a></li>
                                            <li class="menu-item menu-our-shared-mission"><a href="m2k-join-the-movement.html#how-can-you-contribute">Our Shared Mission</a></li>
                                            <li class="menu-item menu-our-partnership"><a href="m2k-join-the-movement.html#how-can-you-contribute">Our Partnership</a></li>
                                            <li class="menu-item menu-our-promise-to-our-children"><a href="m2k-join-the-movement.html#how-can-you-contribute">Our Promise to Our Children</a></li>
                                            <li class="menu-item menu-the-mission-2026-parent-pledge"><a href="m2k-join-the-movement.html#how-can-you-contribute">The Mission 2026 Parent Pledge</a></li>
                                            <li class="menu-item menu-together-we-build-the-future"><a href="m2k-join-the-movement.html#how-can-you-contribute">Together We Build the Future</a></li>
                                        </ul>
                                    </li>
                                    <li class="menu-item menu-item-accordion menu-for-partners">
                                        <input type="checkbox" id="accordion-partners" class="accordion-checkbox">
                                        <label for="accordion-partners" class="accordion-toggle"><span>Partners</span><span class="accordion-chevron"></span></label>
                                        <ul class="sub-menu accordion-panel">
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">An Invitation to Partner in Nation Building</a></li>
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">Why Partner with Mission 2026?</a></li>
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">Our Partnership Principles</a></li>
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">Our Commitment to Partners</a></li>
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">A Shared Legacy</a></li>
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">The Mission 2000 Pledge</a></li>
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">Together We Can Transform the Future</a></li>
                                            <li class="menu-item"><a href="m2k-join-the-movement.html#for-partners">Join Us</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li class="menu-item menu-item-has-children menu-stories menu-theme-green"><a href="m2k-stories.html">Stories</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-children-s-stories"><a href="m2k-stories.html#stories-of-hope-2">Children's Stories</a></li>
                            <li class="menu-item menu-parents-stories"><a href="m2k-stories.html#stories-of-hope-1">Parents' Stories</a></li>
                            <li class="menu-item menu-healthcare-heroes"><a href="m2k-stories.html#caring-hearts-healthier-beginnings">Healthcare Heroes</a></li>
                            <li class="menu-item menu-school-stories"><a href="m2k-stories.html#stories-of-hope-3">School Stories</a></li>
                            <li class="menu-item menu-research-into-practice"><a href="m2k-stories.html#science-inspiring-everyday-action">Research into Practice</a>
                            </li>
                            <li class="menu-item menu-voices-of-india"><a href="m2k-stories.html#one-nation-one-voice">Voices of India</a></li>
                        </ul>
                    </li>
                    <li class="menu-item menu-item-has-children menu-contact menu-theme-aqua"><a href="#">Contact</a>
                        <ul class="sub-menu">
                            <li class="menu-item menu-founder-enablers menu-item-accordion">
                                <input type="checkbox" id="accordion-founder-enablers" class="accordion-checkbox">
                                <label for="accordion-founder-enablers" class="accordion-toggle"><span>Founder Enablers</span><span class="accordion-chevron"></span></label>
                                <ul class="sub-menu accordion-panel">
                                    <li class="menu-item"><a href="Prasad.html">Prasad Garapati</a></li>
                                    <li class="menu-item"><a href="Aperna.html">Dr Aperna Volluru</a></li>
                                    <li class="menu-item"><a href="Gupta.html">MNR Gupta</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>'''

for fname in files:
    if not os.path.exists(fname):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace menu-data
    html = re.sub(
        r'<script class="menu-data" type="application/json">.*?</script>',
        f'<script class="menu-data" type="application/json">{menu_data_json}</script>',
        html,
        flags=re.DOTALL
    )

    # Replace <div id="menu">...</div>
    html = re.sub(
        r'<div id="menu">\s*<nav role="navigation".*?</nav>\s*</div>',
        header_nav_html,
        html,
        flags=re.DOTALL
    )

    # Replace <ul id="menu-directory" class="menu">...</ul>
    html = re.sub(
        r'<ul id="menu-directory" class="menu">.*?</ul>',
        directory_menu_html,
        html,
        flags=re.DOTALL
    )

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'Successfully updated {fname}')
