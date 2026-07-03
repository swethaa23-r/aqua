$files = Get-ChildItem -Path "c:\Users\SWETHA\Desktop\aqua\*.html"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw

    $brandColSearch = '(?s)<div class="footer-col brand-col">.*?</div>'
    $brandColReplace = '<div class="footer-col brand-col">
            <a href="index.html" class="logo">
              <i class="ph-fill ph-waves"></i> Stackly
            </a>
            <p class="brand-desc">Pioneering the future of sustainable aquaculture with intelligent technology and data-driven insights. Designed for the farmers of tomorrow.</p>
            <div class="luxury-socials" style="margin-top: 24px;">
              <a href="404.html" class="social-btn fb"><i class="ph-fill ph-facebook-logo"></i></a>
              <a href="404.html" class="social-btn tw"><i class="ph-fill ph-twitter-logo"></i></a>
              <a href="404.html" class="social-btn in"><i class="ph-fill ph-linkedin-logo"></i></a>
              <a href="404.html" class="social-btn ig"><i class="ph-fill ph-instagram-logo"></i></a>
            </div>
          </div>'
    
    $highlightColSearch = '(?s)<div class="footer-col highlight-col">.*?</div>\s*</div>'
    $highlightColReplace = '<div class="footer-col highlight-col">
            <div class="glass-card hours-card">
              <h3>Business Hours</h3>
              <p>Mon - Fri: 8:00 AM - 6:00 PM<br>Sat - Sun: Emergency Support</p>
            </div>
            <h3 class="mt-4" style="margin-top: 24px;">Newsletter</h3>
            <form class="luxury-newsletter" onsubmit="event.preventDefault(); alert(''Subscribed!'');">
              <input type="email" placeholder="Enter your email" required>
              <button type="submit" class="ripple-btn"><i class="ph ph-arrow-right"></i></button>
            </form>
          </div>
        </div>'

    $footerBottomSearch = '(?s)<hr class="footer-divider">\s*<div class="footer-bottom">.*?</div>\s*</div>\s*</footer>'
    $footerBottomReplace = '<hr class="footer-divider-premium">
        <div class="footer-bottom">
          <div class="copyright">&copy; 2026 Stackly Aquaculture Management System. All rights reserved.</div>
          <div class="legal-links">
            <a href="404.html">Privacy Policy</a>
            <a href="404.html">Terms & Conditions</a>
            <a href="404.html">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>'

    $c = [regex]::Replace($c, $brandColSearch, $brandColReplace)
    $c = [regex]::Replace($c, $highlightColSearch, $highlightColReplace)
    $c = [regex]::Replace($c, $footerBottomSearch, $footerBottomReplace)

    Set-Content -Path $f.FullName -Value $c -NoNewline
}
