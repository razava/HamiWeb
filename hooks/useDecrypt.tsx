"use client";
import React, { useState, useEffect } from "react";
import JSEncrypt from "jsencrypt";

interface UseDecryptWithPrivateKeyHookResult {
  decryptedData: string;
  error: Error | null;
}
export default function useDecrypt(encryptedData: any) {
  const [decryptedData, setDecryptedData] = useState<any>("");
  const [error, setError] = useState<any>(null);
  const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCfmb1aGcWsqJPp+v6e72CPngE6P6FoCZCJESwDTXUXiJiAKshB
WZ9nlN+IIpQr6h8gmxi8SWbofPWmSKZgTyU2MddxUanneuywPTTUj4HQ6/DUaDwF
0Vr6Fk0x4yi1GKpBzhRFPyOYBWVXKIw23j0l+EWw6+JIpR9Kwu0TezHHFQIDAQAB
AoGBAIVxegy3t7vhR6s/HV2uMEJkjgox4banKJ4yKWapgNmocDnZi454bPuiUjP1
FYaSPmx4wXnMtap1sL7Tx6iHBEi10KB1AghDZP5wJHz6nm9ugcrGSSWhVJM74x6C
ThVztAV/rydaZ6/DLaqsBg5lHlo1DjMKq4sxnqrw/LUMGtOBAkEAzt8bnM1Ij/rF
i8oSP3gI0H914vf/0N2xxGGdQvMmJK0oijIm5j8dFDZf02Ft34SFeVJfXyVPapDE
vQ6TRw+1HQJBAMWAwvbypbtl65Dn4qCj3oJUmmnjjxm5080idF1S6ufo34p2gHMF
qLtWjmnGqjh2Shs7ahnfbLF+cxzgBg7yEFkCQFYGl1/0Sel9uepwpHf6PYgeiPJS
ePHtTwBAK3pszH7R9xrI0j5LHpeKKP0o9dzOKgcShxB03nqNKxMHXZ1eXc0CQFhD
Ot3xgm9FFQklF/qCQSYtePRpZcIxcZ3zD93E+IW7ZGsUmkLM/KL8A5jx15B0DJou
6zO0zXZk9DyrQQnc08ECQGy5ti89HmQ6I6Wqq5ADglCY6YPISsNwScVyvu/WxQsX
dEqG/38xFdYTFEekexcHnT/Vt1MW4/j76vBJHYWuAJU=
-----END RSA PRIVATE KEY-----`;

  useEffect(() => {
    try {
      const decryptor = new JSEncrypt();
      decryptor.setPrivateKey(privateKey);
      const decrypted = decryptor.decrypt(
        "FLjMFDdOUjeJDhBdTXjqkKDx81H6gWwXxvx0sQHTgDFiUoggMwCoJbn+eruMdjnppksh8zhm3rUPCIKeWe6SEuw1PX1MaKpDvZd7wNphKgWb6pLafTQTxsB0eLmTurYHkvtOyJkMHhdRravaEeoGSKmMeC9G2ahYpVYgobicBAU="
      );
      setDecryptedData(decrypted);
    } catch (error) {
      setError(error);
    }
  }, [encryptedData]);

  return [decryptedData, error];
}
