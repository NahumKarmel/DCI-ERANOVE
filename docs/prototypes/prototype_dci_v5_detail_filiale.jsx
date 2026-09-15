import React, { useState, useMemo } from "react";

/* ============================================================
   Tableau de bord Contrôle Interne Groupe ERANOVE
   Bloc 3 — Prototype V5 : Détail par filiale (vue Directeur CI Groupe)
   Fiche d'une filiale : évolution des indicateurs, traçabilité des saisies,
   pièces jointes, fils de commentaires publiables, journal des événements.
   Règles RG-13, RG-15, RG-17, RG-20 à RG-32, RG-35 à RG-45.
   Données fictives. Aucune donnée réelle du groupe ERANOVE n'est hébergée.
   ============================================================ */

/* ---------- Logos ERANOVE et 11 entités juridiques (base64, aucune dépendance externe) ---------- */
const LOGOS = {
  ERANOVE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAMAAADlCI9NAAABgFBMVEX9/f0mKDHO19Ln6e3y9tKttraHiZG2xsrGyM+zusNFR1Do6s2nqrLX5uk1OESXp6vV5c91eYSQlZmUmqSxxrXQ2K/T2uIvMztXWWRydXpnanO61M/m6LNSVV0aGyWYtbNcYm16ho+Rp5YcISg8QEmot5PDyK7b9fDz9bTb4rCiqpLV2JmBlXWesZUVGRx6h2+cwMS40LrAvssRDxklKBstL0BAP01ESDxiZVR5h1+Af4aAj2e4uXi/wn67x5zW8Nrh3+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAm1ejxAAAAYHRSTlP//////////////////////////////////////////////////////////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbzax+AAAEkElEQVR42u1Yx2LjOAwlQVEsFtV7cS8p07fX2f//qgUpOcls8W4OiQ5jHKxiEnx4eIAkEnK1q/3FFouvnABvOrLF7JnwvDnWLRbeuLLnzSMGKA6FheB5vTcHBbC9LUYAxX3fz4AgfRMXv/x0FyMBxe3tonjlLAAneRzH+fuDd9Pf/9YXxcJq8dXUEAOPAfITObzx+r6/7wsUQn+DAMjL52IBhLwXZAvdqovhTRx7Vo39or+5sYp8YQgskEwSwsFEXdcJ0+WfSfz2rWUfAdzcoiQXObwkgiN6h5QQITq+EiI6dVvIc4gxBfe/2nr0CMCLF8A+KIUx3cqsohK2+UkIjghQiIdtegfeEYAD6pRLyxlPEz9TzAmXSM7Z5EVmvj9e8MAd2HhkQZYG5UUApdhI9GsEL09d1nWnD/wjcu8df6Q7+u0Pd1AGle9rutSMqJpSWtEwICQJgxYvhsA58StqLxSuqEMHAEIcT/hAl5RqdREBDzOEy6MgM0QYECcBR05A0yRQfqWByDDUtd/4pNS0VVAmFB36NNSN39LKOk+pztQ4mNWh82rCGgFr2vCgoQO7BEBkiUg5BFFkNlyoyJD8cAfNzrezEhoQSeuRxHbpu3AtgJS6/1Pauqilyyb+fwZQ7mtC1rvMpmFdyYsUmDpVHJMmmlREIhOkewuwRwZxhYxGRFF/7Fc2qDMAnwqX6hoZ57QZB+gBUY4pKMO1Re7ub+jlHMh2bVQWtUMSRcKUwAjEeZU4NzXOlTZKtIAmY8IpCjCpuLtoKDiUD2iS71y4EgdHNHMU6/C/SskIlSQbpSJMgPmEmo9X1dr3/UYv1wx9jQFmo78zA8EEQDyck7ayaNwFx8E+bdFJsl8ml58EhhDlkgyZgg1gVxZGhWGF+g1touUUeToF6r/jEw1OJPIRwLoqkad0RBmQrAptceiUXe6HDz+ogybDR4MQpQqTUkrJRjabCUD6mIKnANIJAKbAoFLWdtbgyPClkMCe0ZWwCDYREdwI1NAZ3hlAMB3/BiCYVFrutcuDsHNwPt8lz2+MGw4nooSpQ/Eg0mlho/djte3UlwBcyaBFu+as1XbHbXnuy2c/nzJj4+eo4MF2XMUfNWBFhUsHdfgEwM8IgCTLBnUehK7e2VCpgLqK9Wlt73D5HAilElxwbja7Sg96iTHJd+0k13ZHw4p+v1R2zTHv7TefcERNK63pVCW8Cqux9UCzDLXWY//6vxRIoXgsgIio3WvdoCM5pGdwflvXKtB4M63HsNLa1jikA449t5tsaKeyYGmr9ZA844laRllWdibPV/iWIM2TOplO2Zd18+T4L2Jn7FkakEG66aI83m63ESsZeXUr040yYIDnXTzLlxlTooxW+LpxeoV3oX/sywyMgGjLeZTns1AAkegAexDMszwh+erDKo4LWMSzAVihBI7HI4/nApB3JI6Ps+1TQB53Xl4UxXx7JB/z4nDbL7y51o+3efE7fhdgTxCzdAJ+yO03of0ok5zNwQCqHwlAAMZINlMa3DYRm0+GCz7rtukfdrPwa9+3vdrVrna1q13taq9hfwKEnkYkHRwxPQAAAABJRU5ErkJggg==",
  GS2E: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAsCAMAAAAEqIWJAAABgFBMVEX9/f0WFhXthRAnmVQlJSPo5+ULCwpISEfodwvU19TjZwU3NzbaZwrw5NK6urhXV1bkiijr1bbluYuOx6fqy6onik1LmmzGxsVPp3NxtY3kqWzbdRLYhzdmZmV1dXTXdirpw5caiUUgIB41nGKWlpWm17vu28UMdjIWhTzSiUnbpnLkljeKiomky7XTWALBwrviXAAdk040omGHuJimpqa42sYtoFvUm2bO5dXkmUnioVXmtHhrpHzdhBDWl0/colPUrIfY7ORbs4JoqYXauYzQ0bTY8ufqiUbhm2RgYF5uwZfLayLNvrLukBtCQj9Jjl1VpYCBgX+KrJWRvKGhoZ+2spC0zsG148zUwZrtdCDgr4jkvaHpz8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACzW7yMAAAAYHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAABe0S3cAAAD3ElEQVR42p2Vh1brOBCG3YvsuNuxHaf3QgiEEEhoFy5w6/a++/7PsTOyU4AQEoZzQJqRPs38GhmGecVE9WB891N4zNfrx8fh3didfGD2NPXXi4CnBojT03o6DMeTPRBRwB/x/Cn8vLB6tBvoIPD5dH94+8V1m2iu++U2XIAC903GH8jgj+qhOzl7FvowcW+PIUferx9sZZxdAOOIj5oPr61oRlhsNTh7bUGOOfB9/ihwt9/Fg4u1+S6s32Df7F+qfJV3d5IOVt7lnJeRqXPRqfrRw27X6Pp+J2xNn6fTjaNqtf7nzt1wFnY6oZ20njjLn8bg3asxo2o78r6uZ3NVNvxOtGd/u512My6v5jfDj0F7Xwhg2r6qdxez1vBx3A6Z/S1qR/Ph4qa6wxvfX75kVVw9qNUEhhswP0IyeiqNN/z793aTDhuywLKC3KC8klajEwANNPBrA/DmNTm1H0y8qbZ7PoyzVB4vAnqeJrHUJFllVGExUUU5HUqw0ci8rCTgliB0RmXMN/d1FAf4vERNwhPxWNZgTJjIpqnB1gbs1GTISzphDFZgBQ1MkOnBvEf0Cgz+1UmPplLCfXmIFIU8IwKriOgGePIyFAP7pRL9/duaMsE9GX2Cv70RucFbxn1aJiVkCDNErn1Ba7WMcrLmHR/qI7zsLiE3WNA3iA9WYZOWZzaWV1OCWgyg1NhU4DQwuS8Q7LxE12P8FqxOKRVNdSG1xJZSyM8QhhIPqRMtpYj3OimAvMlIx8IoJb1iQZIMVMSEbKCMQSaahHoihaqrZUl6OsFLmo5IwmS6UN0ZDe+IuvKlzFkECDYIUJ7qwvR0WpGjk7T9UImSmOIMJj+gbWtSyTFUZDZSEqI/wh9bJ4S+BZXFXvhc1KiMRUkzB43PNVSDKo2Kmkx+qa5MT7GJovfot4WQ9H0b7KJd2bzILntUXRsDZWlUmCkhusekJaXJYL9hWChCo5zIdFzD6xIWpgFlOVFpIUqqKiOWiVLIvlnioWHkxdXYoAeKS3s6hmYDSvZpcGDYZd5jPV3Rk5XOCrl+B+RjQVH0/5b/z2BWiPeG/AXbyD+ruacDZvaOTMh03eOBR7nK7cEQewoHW546AcMpibMzxEsQ0nvublkKxyl9eydG6/qSs5TCpkNjwHDc7G2OHVuwUEm8zdFzhfvOcX1nmz65yjlHbS6+tqTS55DDXc3tjSTbmVkUYcWtbdkiJ113HjvekpVreZX5tbWI9VpvV70AoU4WNe7y8jJzcsm1s1NHiBSkcC9M4ayZ09qjqXLefNbvWyuCBSVWbPEdry2Xsz2vAubZ9vYq/geqbVjGfJKWfQAAAABJRU5ErkJggg==",
  CIE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAMAAAAO9CvbAAABgFBMVEX+/v3qeQUGizIYk0HP6NcSkTvW1tWn1rbytnD2yZf46NPs6unyqFTsgA/Gxsbqy6lZsXe24cXy3ch8w5QwmlJ4uY0yoFf01LG7u7vslDVTqG+GxJuQyKTqiie62MNhrnmb1K6igxqkzLDobQDqnEkij0dmsX2dewijewq2qGrOv4Daz6He5+Dnr3L0sF/90J0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABXJyEDAAAAYHRSTlP///////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABK/6+FAAABkklEQVR42u2VaZeCIBRAWYRMzLJ01LS92bf//+8GFBeQV82X+TCnW9oRvYDvwQuhO39KAOOBaHeOQQ6UMkbHMEoWrTyD5GdCKCMODDn0bQpc+P5blSZkUa4syjXrZRw6AlE3TsoVicc3k6HsO8Io5ey1RFuHvB5O2yULfPb9QI49lktC6bWRi0D9jOUtYQ55qsmakb/QQE6TDqqSZ8tZm6CN6mijo6jlXZ8mxghzyLMaXKCswNiU0+RhwDjaWbtYNmcs+zFlK9ywXKv4glwRCsu1Csue+527RR0GCJYTRsGAyYhlKlWGfEw75PpyjHwapAohOFVqm9pyEGqmDvlJprfjhuVpyF7cF5HYS8mvZIOPx6u7CpYT451DeGTHfk7Nd57NlzafMtdLWT0rUll180iMXeUsgKrx0CTGRLm9fAJL7wsBWetSp2vA93TE+34CsI9v/k8RQlx+gAvOI67OiiXvEbJd3mkPp8wjRZ6rExe5Oud1i4hkj7nUZEsUcWBuqgchH0VCX6tv82kurs//zn/kBwFBImRi0Y1TAAAAAElFTkSuQmCC",
  SODECI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAAAsCAMAAAAXf8V9AAABgFBMVEX+/v7M59au3cIwsnia2sILCAlpaGjV1dUtKivm5+ZQuY6Zl5h2dHV0yKWT1LXJyMkXFBU4Nja2485OS0yKiYqqqKm4t7dmw5nT7eRYV1io2LwvrHmEzasgHR7Z8ug9tIdBPj9WwpNivJSgnp+gn6ATp2130aklHSBCP0BGrYifoKC/wcDAv7/g398AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANCa+QAAAAYHRSTlP/////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAif/yeAAACDklEQVR42u2WiY7bIBCGx85ygwGD8ZVsNnv1fv/X62CnapxtVUvrSlWVX4onWPB5PPyAAW76L/Uosz7Vm8D2u1djzGt73ALWjVUxSVYb0OSpvs+xrsb799MM5oahGOSx2yC58pjrX7f7bea0bTG5Sm7kkE4izVRbGU4OaLpyK1rOS9b/Lu1xU1q7oIkmRiXwT6OUYgAWg0rntvoKwFTMbTZ1+hOtJ4cPxAuMzpGDBUocIaQH8PkGheRyVKCIfWu4a5pwVIhILEYmEtGgOWNM41BPmbUM+oMVjHt4cuytQ9Ad5tIh31zEaxKMNBg5BcoxMvIMXE8dPga8RI25/YKGee3vLu94EgJNYK9oT+B5CA8JfJj7zTQr5t/PtbBfrAWm+8CJZatoolfAgjoPrTOtMpe0lJ9Gmt++6URTFJ4zjVELIurz0KrFjW1oL1PDwkMijcjROj3TNEmZnBU4Ps5zaKZZQJKl8YdBclqlXNbNPzhnIRDvnUvoEM85wYS44/ygIRLuOTplcgijMTW9bubKTVt4ceoWdaM9zgK+AKUaY0O11lHkNLSm+PqfKaXY/kIzQlkmGvRNLlc3LdECDVdXpnjfxiuNOU2IvTE7uXvBPLF5t1oLWjG0Y9WduUNZmhcp8bQZdys1Ls+SoqyGOUtklTXS8zorV+t6H2dzrYpimhOBJ2turNXtU+mmm/62vgNwCR78co4UIwAAAABJRU5ErkJggg==",
  KEKELI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAsCAMAAAANQyXzAAABgFBMVEX9/f0MOGh0w8nO6uwZQ3GHy89WdZdIao42W4S4xdVQtLuW0tapucktVH2FmrK54eT37C0kTHfm6+/b8fJkvMM4q7NtiaWv3uGo2t3Q2eKQpLrI0t1busB7lK3BzNj47kn59av58Wo9YYdArrWZrMH7+c6dscX69JZifp0ALWFmgJ758FgAH1cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIEi9yAAAAYHRSTlP///////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYeqVAAAADWklEQVR42s2UiXKjMAyGZWzHYHMUAuEIhOZo02Pf//lWkmmTNKHtdmd21kOA/Mifpd8CgH8z7rfjOG4ffjz/YbzzY/vTBHDuuN2+4uX1Zxng/CPfbL+VxbD4qIx3r2hAbCRnc/ySsFMfhOPI66a/WipoHL8kHLrb+npVfLfsmcBiHrAyfGnDkNJc5cqsec088o/zDs5180Lnp3O3Frm/PK/oLJQSikI3zzHJsUhocUN6TkskvKAJrwixCDGyE8osckFBG8GEkC/pSQ8XMwSOLBKFKa/5fjNNpQlFrg6oJyQlM4SU+bGgSiCiaUxolaLMD2f6DKHNufYX0bJkVOEJCzFwiJBez2cJC79IaKaeEGsmeHPe3COb2hlCRIYfHw5ql/J4wdkR/tiQ40OnjNefRHSTkBRGPALc3Ye4YzyUekRC1LGN5zoSbxHCASMLjsyVH+KAhDRR6wIu9cebBHzeDiu4hyg30TQkRCoRaYvVoa7e9eI2AW3MedfO9UipBIZn3otwd9JvEchG3zkrsTkjYMpr3w8rsT4Rrrv6iWz0tnPL4KYtuKvNe0/GXk+fZnLYTe8FfV4EfgXinBprw91VhCJiPuqdIik0G3TpkhBNxaTEUUmo/LrcYxN50lf8DVMYeUGIpm8QEWCgt3hHjdj6RgaT8OeBmoEdSPBmgDC58aXpuIFjY4YLOYp9o7/p3ZAOEXQd/JcjyPCYapd/NtXtbeVA99L1EjE0+uVVVLm3zRxBB1ktIVhCIKH2Un2ZHUNrt59LTfO6OD2YiQimk3OfEXRlS2tLTF9XPWgSAkoP67PWLpmQaSgrDZoXajKg4qXG4pgge1eXrrZS4gEl4KXMYO+khaZvfA61q3vUMd4iJ3MBPpQVPtS4ekY+aDoax+EuQzxNI3/YSTwyXL5xTQM2wJKprgyDKFXn5ORDIF3NBF1DFjBBeoK1+57+SJc5GeCjJf7RjSecOXkiVLa6IJS4X5SQ1FI3jcYMLIbUnxDqpbfvjeBPRACtZeOwRIkh2RVh2XjbvOFXBOwYnBqALJ1XPEHLbPmegyw5vAlOhHJyEp0LsBoIelhaJOBeeoKraGPJFz7KytLMfl+5N8LUD+RnhSTMAWwNEt8GyT58HNK/FPLUoWe9Km9E/v34DZufMlXpnJF5AAAAAElFTkSuQmCC",
  CIPREL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAAsCAMAAACqslFNAAABgFBMVEX8/frtggXxfATx+dX56NHRhS1YnDWOxnTYhA+XuYf3qVL95bL0xo7rlS/22bDstnHWwqpllkXRlFD+2ZdToDTTfSjSjEf1s1DafBHoiyxYm0XWs3jQmWOXuXvd/dX5xHbnxafrmkbz28zlu5DavbBjmTnuqWzjvaiQw4XUlC/xkxrx5uLUqHHawpqktYXWto37qThSoUehtn6yx67XplfVqoj7sT3/87iMrXPUkw/Q2sjz3uZdiEZlikW3yJvP0bbT5Lrc6dP/4JhRpB9ppk67mly9kGGhrnm33q7Aj2Dd+uPhfCfyr4cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/XWsWAAAAYHRSTlP//////////////////////////////////////////////////////////////////////////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAAACl4YnGAAAGL0lEQVR42u1YaXujOAwGYzIuEEhJQiBpGxJyNuk5M51r59z7+P+/Z2XJNhDSps/uzE4/7Ps0IbZl+bUky6KWY31POF9J5jtQm+YXF0Ew6wTBMu8AlkWRz2YdbgS4YznhRV4EQWe2zPNOHgA6HZiV0/TlUk5byg+pyJe5nJ4vZ52LAL4quOiEMNIpZp2iKIIDzBLXFcLt9/tp6mqk7ktDbToKrTyRwyDlCreKrsUXLsx11VeJBbdy+tVXUC03Di3+O3XF/EFqsz6zJRijJ/6226Ee32xB11W/Okwi8m/gTF1h74EABdtUi5KwaqWBwxOGmDxMrdO3NTWDtN3VYcBfJusv1kjYSK3kV1Kz9bo0SHsQbd/a2pXuch4bOzymdUDoYWoMl1FLS81s0nUUNb4Fq3SRmtlAZb2B9c7FBv7pESapTa2XTG+iSo2xyPqcoPBBaq7iw4zlssAwG7mgumtFAoYFbkBLo7ymxkpq5D8bqbFqoBifRORQ6Dk/QE2Q4srOxq+0O68kb0mtGmpZad47h7uKZlZxGXxl4NAaYwMXqLk0dIDacxKzr8eBgokz6yoRtrKaLa1me0rIE7TiQFJDn52PAxyLMnIr+GqEnoVJQQUgxC2INS30MDW0mBg0899FLGyiNpI/hPQFpcrCTOJrOpHaAH7cx3AjakwIYY8bijkqxrPysENxFQibhoKtoFW+oEOlmxQ1q0A32sxzfBWqJbWU4tV3RnrSnlxKB/wwNSQwuG9v7LyMNU0tUMHvqbAp84CkZiM1S1PL4pOTGD4IeOboUGXaB1OuOkZ7qCWCkoGkphzoT/mGcz9yidu1ijWg1vW5RHeN4WmosZ2UCUkzcqYJHZc2/yrUEGsPNu5NJhjroLuklkXxZHESe5PKMVCJpk7NFjJ5kLrzf0wtLqkJlTtF36yHAVpaLVBBphKvsdpu7rDFGDZNnQeSxyy9nxplyixU1CrXBuVBTc2WsTbWGblqNXvXakAtomMAeeVR1OQq+6nBKrvUNL3SapLKK5n8KLYMNTR6u4psEgfmhB6ipq73R1Kr39Rlyl37Fn8hzI3J4pLaoFsiBHBLVx7tx1Bjtted8gr8Ss42sQbtVCZRc1NFFs9sk6LCWOjrUpZiI8oQe1LuO03tUFGkNuomlUowca8sfkK+OS+PQRtOJ4B8M5l4UBVS5WGv5SqFUNwmXuEgNdx0WAe3NjqvBdCcTqnblyONogjJiZ3sA9RUwNMdKsUGfg1QmkPKRWpoAO6RSyHJQXiMVOBlSRwnGq77wgdqyrrt2M2SJF6vk2S9Xv8cOo2iqFFVQXuBVtPUUlxfjJsBWaVmddsp+n0sq6ork2/LOE3TNuiYSmpCbleY1GcLN/L31WuNClreQSdpSY3dT42V1Jwgw/OL9fsVqxX29MgCqLjQauhsUTlcnr+nlCzr1BKSmtDURqlNibyZ/OiiV9SszV9YEogtR2qskgTpGUg5SQ0XESU1WVrv6NbHiu3cdN4rrG/AB+ddVQQxETWs5rsplmWxes+BDIL6YBOBXbtDpTtViqKappaJ2SRsHFceRIOB18AC3nuKUSR/QgiEi8i7u/OisGm1yLu+vvYWhVZM97u8QmDIWyy8O6N9EI2Vz0JYc2fRfO87NN8H2h73fQfPHgpt9szeKHmjLcLoS19wOcuR2h14Ikq7UHN3uW8NvvgTXTz6Vqv9C715hgH/ZrxPh35Xa4w5Z42ut5dHR6enp/A5qkJ2rfAbcHtrui9rUreXetbl7eXlh8/Swbl8dWX0JgbajVqaearV3x7VsVqtjp7vvLa8n7d6vV6r1ZofVzBvtXo30NdqDYfD4yG0ei0pNJTfPWr1WvM5dqLQfH58+pt6qUZqbgCtX98Pb4YVvdAaojCgut4xrPLD67rhnh+3ej/2iNx+lIO9XlWwpzpo5EY+flp9csIFvpJmHqYw/np4U9cGxPav06D29ugZYrV6VsNqt+MQSP4juDRoizeiHdA6nx6v4fSDsxuYFJpODbWOs70iddGzP4wmSFtvRLrgRv+ZQUVnrSXbevY3/nfj+Jr1F9x6kggjW3hPlJszbruF9UThF78EzhPl5gTbp8vNv/r4VH0KdcfG+h//Hf4GGbeF1quXBsEAAAAASUVORK5CYII=",
  ATINKOU: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAAAsCAMAAADyzcJUAAABgFBMVEVWmmYopVfpZx+W5Khs1pbXopLR2rPgk2vn1twheDhcx3mZpKW208q6ucfnaUL9iBv2w3wgdkIqhjvEucMzxXJ1taK1fEGFrH38/fyWmJbyZQz56NP06en99NbweC/X++n9167zh0vN99fO1tAMhzPN59L4hzP0pnD32sz0uJP3lE70Wwus1rKVx6n8xpaR1aupx7CqqKvxmW21+M/yqItzuI7+47eWmqSJt5WKxZistqy26Mqil5e32sit5LfvaC36yqoxmFLRekr5t3hRp2nTlWvV6OQPejENlTfWaivWhU/1lDLQiWnUy9DteUeVuacVlkkuhUh1qIiqpZb7pVlJtWtyxIyXjZaLpZLYZhfYdjWS5rLXqo3QxrP0vKlwqXYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT+Xk/AAAAYHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9ebwvOAAAHsUlEQVR42tWYCXvauBaGWRLI1mln5t65QvKOjbHxFjCEJWxhJ2xJs6///1/MkUyAJDTtzPR5LqMnNWDL0uvPn845agh92NITLKQ+n+pPabQhLbTu5PZDgwTfSLYupE5TwkknvdHAv0wuWhJj3vGzqVMglqUNBia6ALKauiHx5OlJarR0GaecTQc2UyCr0xhNfEeSDNNsbLIl0oZuymZqUm85k/pENluO82LqDQWWCo5hyhRYEGQ5lZI7BrfJwA8j3XBirezEkHTghUV3l91ohf1fBPPii9OA6MtLjpn6/BnLhc0OaxAlTs24n+YeH9NEapmbHdbQk0yBU/W6QW4Sh5/GRDKMjbYEJzm6Cdki4pOviaPrxOHjzmanZi5NiPTFnEyM9NcEa0ef4HSS30DgZLmL0DhxOE6TQsN/AuCbxNHR0fUhXLsJJTcO2AqFNAC+vk7cfH0kaY5Q4ERiP0GBz38N3YsbBawUQ7vNHAAf71MfHG9zHLPE8XHiEBJH/tfwbEvZIODk826vSYnG11TUxFFizB0y4ESiDMC18EydhWL/cEbu1cc/AbaaPTV0TxVMsnUGLfkKGOW2Zmo/VFtHQQg3/wwa/ULPcBw98oQgwgdrtqM34NTjg0MWtxK20Fcau8QvIykh/DtgpXimzvZyzKNvgRNzYCS6TVVtum+NnN4eybJPI9/TaDgajeLD4Qj+DODa7jwQxPmjTqcTL7BZBSzABePuVmecRmdIu8AQJ/M2PDnJQjGbji8KGKkzWuSBF+Bk6EwNbx0EKMk5ZWIFeN6vdqmqs6vXRua2Bxhn6lme5/V6JFLHGEciGA90wuu3OCUhMoKftwOTZksiZHAWgAWcAgZOF26x3EBcZwB7MdqgdhEwvfY0iMjz6P8wiMTfAHuhnnoZfVFuHEAeL4FZWAveRH6m9tqVVV5/gFOnMEuL5yXDN3z4evqlZTjAp2MKnI7XcUTAEZbfZQDmkDHApkQanVss6BKP0ic4FSvMm2NiQeKNTGYBXM/Ir4DF8zO1uSIbXXQsNiTJAni5SNzmbLZqC+cOC04hC1M35vtAjPW554CLKmxifNGaMHg0xBhKP6OeEbLZEzjlUHOnBXyxTEv+3ZABp+YFjI7fAGvhsBrOLTUbzwVeAidWgFFU7a90l2QcuSggAyafKwLj6/OLBjxMANwiDVDelHhQ2ARg8A0GJ+FW8JB3i2eE1eYP7mDAFeDMG2BUuez3L5er/wMPs+Si9v+zyCCgZwbL2awM3swEk4IPdG4VmOswzZ1UZiC3KDZBDs5EdNgrYuGJdiUnKwrzOhbS9JEiEot+pPNWYXDmXl9t2i93VAN9Abj7DrhL7bO1fB0+vFtZhvJOhtnvjBfgVwpz2xnG05AjVFhsAjwsOvCwiTODLOjYHdKfNBRyHGnIAXAGx33ff3iI/wEv722UUNxmb2FjqvDReoWtNiy5+6XdH08idb0QxN5sHcxMgSO3C4WFW/DJTnwQvPF0tp5hwHwLRIPFRoxUBg8hfIHvBWEoCxN5OBSYaSTwToa1Wwg1Dv8ucdTaqvqsrbfE8Quwfab29yorcTjmb/uF+WBp/+KCAkutC+clgrZ0g8bhbDbIE2ndhAbvQdJ1Flp558I0sw0iwU6dtjo9TEwYhm/oMvSV6UF3yJpMp1yFe01rDnz02sPXn9jiDM1z92rjl1kI8UE249+e4RedSIGnGQwemV/cDw26SSttLgE9Df+CVLimllDcsHpWAh7uYP868DD5Oi+HqWLRkKpe/ox67X0dwf9gv7fl5T3ksTaNFjuHbNVRYEA+pHUw+R+1Q+5n1Jcc95PKSxotaK1Ax/SOjl8ULu+wYLYLuftdcSlWETqg81e1b86hvar7Reun7jiUaFid5enk433qYQDeBh6+FOqFw2vk7d6IqAxAVbtKf3UZtkYzN5eE78kxPKzmAWayO5e1wnqybhrt3U0Gx644telnVWTPqIn0Jo11Ez/c0x1cqn1mC+53AD4+pvJoz7+BvLl16t0wxPLULcbQwb5btJGWd+2piPZvaqJX/nR4gKwy0qb2dMp6dm33ymYE3o019aBKtItFsTstVrTzvEg8z8sryLO9vIuq//WmLiLnxe7Hm1CaRMIlSjze2fmd2qEKqy28frWR5woLH3auZKOyLVp50WpHa8UKKlqicl5BXhnZN1BcVdxiEIHsin3OnAWCVvKKUqp5bUXLwzClLaSValY7R55zyLbRfl6z86KW1763a1a2wr2z4sKuSums19+LrrcUHZt2yVt2BZU9HoBjoahVUsRpVRRLlgiSW0VUPbcsm43oFa1pAGyXRPtKsc69cjin0JxVvEKPeZcB1+A1oWK+6t6LsZL43W0+SyLtWtCx8ryrztbagQFbrFfFS3oKisWQBjJalgf7KOo/q+Seu0irwtr0rMC6yah1EJR6pUvLq6CklXzcEhGdTHNF4noxV0GWa7ddpNxbdg4plR8ARrnLvhpi43o0OkT/5pKulkol5Vsht7YY9Z3Zqrbt5v7Cf6SwaNHs7V7lcvmz3bO96N8Ovpr27V22onx0n4j+GjC1RU8Nh2H9uf/vnf0PAkMm/q2n9i+jIvqXAENt0Q5d5TaL90NgsJKyYbjfA97A9q8D/hPaO28S+wMKWQAAAABJRU5ErkJggg==",
  ASOKH: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAAsCAMAAACqslFNAAABgFBMVEWOpGmr3ura761kpaaQo5anzZkvi6et2GpujFljrcl3xtEiTVdgfjlYdFWOvuDHuJQrd6B3xbqQtjGKxDvGzmv8/fwQWXAQZHUPZ4fy+dbN5+7X5M3T2ckydo/T9/coWG3k6dMqZXasyNHn6+rO2LMLXIW66PFLeIlsiJETc4pSl6tvl6q3xqqx2OWx1tXI3OYraIdHanVRhpWOqbOSx85zqLXGyrUyhZZLdXjT5LSPuMlSiqWTtbW1x5Nyt87GzM+rucgVSloTVlsqVVUzdHlljaZulpcSTWkkSmdUlZhleYyOp5LF15jX9NRwhGyRqsaOt0ulq4+yuqnT5pkUcXtLbYRigTpug05xs7eW09mX1+mnt2uruYmoymwzgHp8k3sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACbUPPFAAAAYHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9ebwvOAAAGiklEQVR42u2Y93/aRhTAwSPOaJuuGzoJLQRCaAAS22Dj7XiPJB6xk///v+h7kjFgZJz247b5wYcN0o1333vrTsqQH7ZkXtBe0FJLPp/XpR9Xa3lZlv9FNBOKOtVNmJEbbm257kCM6Qm/zKjxAcp21FvFSoDT49bVgWkGYwICFGzikFVzoiWpMJ9G621oGg0fVFZKBtRCYZQa4SCpVPJENUtxPWNsnRpGzYUJDmVLQThb07TSvQSlpFH49HAxtQ2NfhgXX3qnaW3xFFqltmYwZkyuITJgckod+MLfUiW2HSF1e41yJPvIsJ4DTJgFxSlATWxape5QQtfQDErLfnxTg+vyBBpUbD6J5iIZY7lxkw526UfmzNev/KAbUnaJQmSFiG2NGozm5uuBXwnMlVecwhRGHbAVsG3I+BBAuNCTVlcSoaKtMVYen6AEK84Vn0Azdw3qOJwbjTHf/gT6cuqJLDW4ii8UQrbXGOfO23uR6vWyQXOMApuuyGoIikzQTBt1G/rDjm24fYDGn0QTNqxuZaUAHjXy04oBomxAHOsIFtvfAJW9Qvt5N5n+XB9DswEKr2oVsLZ1+PVOa/lIo7zAV+5ZRC0FjT6F5oJ/hKqagwWH6giNObSaHe8H5lQ0jcW1/czJyaJ08KVDFJU0djinW6C2jvwVhMCVsrcDwdPyJ9bPH/gasD+BtqqBYIiA+jqI7Y5GrnFeqLrmSG2WTBYo44U3hCxmTpbOpblMh8gQf6Ja4LwqQG3ZHEPI4087nLHLcR2Bg3BeVhNpKv4h2q+z0fZgOcvY38Zl3IeMn8PsAJ5aihI82ZIgABnjWeKd/HErSe+/dCQyvwZRtgXTcp/kLdlGBypD3E6oLE4e0IflPuWGxTbY+HRpaNFuLBYdF93rPvJJ0Y3DFvKDZrjghDqiwT10vvl9aa6T+XIukUg7Nq7IgHKH/YJ6RWfHQXzMzUZomHMKhQItcHBsuJ+NVsHsVR5a32BafdQr+G0eYo/HIl0hWTL6I2M+Of1z7uZkaU463N49DtavyLHGHI5oHUBjrbebwAYjJtEwsnNVEOZgNnDAKJzP9LUSdejmXQdQG2SsidUKv1tGIXSnpMgy2Pwj43Vi3d7ezpHD3mY1q7ZZEX2CO2jQTpIighwQ0pz5UGuviqJYFPgPfyGbHQYDSISOEdp7e3u2HTKwP21M7aSQHap0xzxUSLTmYJxJi0uStN9u19ViSFeID57AHAEmhwjlBXBcsYxsrDeJ9rciNF/TOEMPuCsQadyY7r61W+W0rlq60MAKHG3u/dw2iZLZMLJEDUEh9BK2A/mwlaARssJgIxszat4e7RPJKaq0PhMN9mnGWxgwrVYrBxfoV8NtfuQrrlbg9K0qv1e66HrGIiFnkDNc+3VPEAHLd6itkjPILvdopL4J/kdz/j/UmqlBti1nVSxZ/BEhvU9u27Xozu2CTdTVNZGaC2YDQ3CjFLuRUKFDVNuFDcIW6llTxu19iEZ8yDQOM6LRblD4fjTI0JAaJvKPid4G2ZOstuHcY7jRYBBtgzuyxAWbC4vzECsG1Wy3C8etY8hOsLuzliD7p/GhaISG2wzmnsSo+TYs7/vRIsoeKBl0BXGPqzvdWIcUCTlNw4MZZStJs/e67y1jTWGHahvv4rl5rqvK3xbidkDjy+roVIRjbT/WGuPsu9FWYQem1QeNwmAFroG95MYrRMPUSKvuULXSeeabef2mxeIm2NpY6821KvaPvNH5YnnMCLilUC2KfY1NHiWP1tmj23u+UhFiKh0L4UN9vNMV672G6za6/ngn6fToWy/w691Go3HZDYqqGiwcZazh6Mrd4OGZCWYQQSWlBQJaVMQzP7bopxc/H+17XhDIgbefubjINH+cJyo4DWUuPn/+CT6vM/1nfJx6loc9SZJlRdal530IfXmx8IL236PldX34RmAyPSR1KaEn4wiSVp/+3gMeABUlpSWZQHkcTWnqup6C5nlYmfdSWixgSyHzgM2bliQ3FV3SrekGpQmhrcxCsyQpLfwtC843RE9DSx+goyBvaqZ8Cu2IrdOcYVCr3zmwrOmpYCJkO5seeHNwfpCihE7/vH/QmRIET66QAGGhKQidviXNQntEa02dAFua1vr6Y1rrpMykN+PkrHtpEJ40KwwUJR1tFfWinKUoHCyUJlFuxt4xbTaYgDyC1pwZoboC4aOkOGk+8cQUF4nL9ItJrFL09Ai1LCXV215S7gva/1v+Annxl+AnQiXcAAAAAElFTkSuQmCC",
  SDER: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAsCAMAAADW+I/RAAABgFBMVEVjoaJ+jMKTpKSc29hkaHpyzsCAfKKL4LnM9N78/f05RnDZ5u5ZZo9OWIjm6vVNVnNsdpHN1+mQlq6vt89FSnNteKhuyLM1PGg7SIVka47M1ths1riFiqtFSYdPp5N5hq1UxapruavS+fJUuaOT2MjEydVMuZiYpMsypYlXY3KQmcq2xdN02cKO581uqJYxOlhW07SKxrjHyOQ3tZV7hZd05MdRmo6Uo7Olq7ekqsir49OGiZqusrs3RVsxpnmIt7GQycqzw+Y3nYiKlZqsu+Kp1syz5+LU5N1CPXJgbaNvrbGFjcmM1Lqv+erk1Ow7VIw3mHlNqaVQxphnnZFpwpx25LeFt82y89kep4Y0PIA7tKBJP4xJd5FLmXlW4r1a58UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFsXr7AAAAYHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9ebwvOAAAE5ElEQVR42sWXh3LbRhCGZTsN13GHQhCNBEACAkizSizqXe7dTs/7v0UWoGxrJo5ZrEyWMxxCIr7b+7G3+3NL+49i6/8DM6ZpUzEWY6WUflfg1kx5nLeYQLZtcBuNZ1K2vhmsS8G5w6mn8JAQimxqOhQhLopvArcmkvdsw/SkOplJMyfUISZBZXhsczCb8h41c5N4BNnEIXnOzZzayDQREqmQbDOwPnYc4vh+npumYYZEyEIJERJKH4V5nqacq83AWPQMaoKkCHafpmEYSgCf6KaBSBiahHjDjcCs8CgNc0oJJalnUioI4TZROTWoxLqkII6jNgBLzg2fzPQQIYN8fGKmSZFhloV8TgmxbYHXB88oNe9RXtd0jxNB/FoZT3LfoMLb1/cdakLxCbYuGE8FR2b+xBFKiVDXcAhKU0RpjXihY3COKOxCrC8Fk44D+/apYdtIKKxN4ImBHLUa8EAZ8xE1QyHURnXMUqBSCucMGZT6fo2WasAVB32h6hyF2WYHRHKRnsNhIJ5p2L7/S8n1kZEWSnLkqSHb+EgzrGFJQWLtuXcNKb8A8LUDPCxXKOIl3Y0t8hqCwD6wayhkd9ro6wLAvwGYTqJNwfVWvV7H+J9gEKJm88ltqfBVvQy2Evjize7u7sNms2klF1efGqiojp5PBYiL5xeDo6OHn2JytRI46lqW2+/3G4123Hx8dHxZJq/gSPy+9f7BSXF09GY3CIJ2u+G67s7OTsftRitqHA2azTiOG7FlNas4KrCepifF8fvHr7KsHVuDgeVasDBE3G4kqz+8OdzVd4FrlWwrSeaXyfHj3d3gFaTZB2CZMuyryvdZtDo4SoAMSZdCu93ugx/fBkBtuB0rDk6DUePPvzoJLBkDv3kZrVVuUTIYHCfJ8SD50H2dHR62+51+Y5SdBs1O0nUb7dFoFMfWcXIZrV3HF/cfDpJnXSt4GZTPqZFlQQzZu+0A8HG/v7PjWkm0yQGJfpoPsp+zuGF9bwWnWaOTJG778HD0uv/unWvBp7fzaMOTF10MrE6n8Wt2Gne6iTXKshFcuyBJlm0lUfRNRzqaW7EF227/8XLU3+lYARRx/NVSWKdXRPOnUB0f5k8HT6HyortsQlq0Ru/5EpgVE/CUZ9MW9BWm5H25tyfltLhxmGxfSuntybOzM7CFLVleSTn5VwP6GVwIfkCEcDgHA6V7MIbAWoER4EKxqsf1UDmXSDVH5TVMF3AbBuISLwGPe0iUy+MCMsIAvgd3MH0Ggy/EVfMk51XzL5eRyHBggOvSsA21BCwhx1Dpi/Xx+ICn2s0AsV+kVcY8HerD58/LFjw5OKiMhQJzuwysS1Laa8crdw4ZG+lND99DBkBaAoYqDG5qCNiRBF1CCQa69mjGllYFPpmZ4CYMD4PG9kcwBvAPTBs6iD5R5/B7oVxYgsEn1OgtTNfXwYvRyVLfNlpVxvmCK3m1W92x6ckt3QyHMUUOeKgvA4OVmKpCgRMUpa+yDZGq/cne9gFyzssB5fR4OFPT/ek+SOH1jNILwNTqkWUat/a+49scrE5ZP1gSvl2FkAovzPjNH7a3z7A25XzMtMX3xP4yjZleLwr9RtmhXsWnIsW4vKwGc7kwfL555q3WFyf1LY3htivMmN7CpQWAYNU71uF1K9jn93r5T4bxir2CaXcRfwPfr/dOP6B+3gAAAABJRU5ErkJggg==",
  OMILAYE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAsCAMAAAD1o94EAAABgFBMVEX+/v4GikgsJXPIyNaWlbM3M4MjHHBpZpWKiKu4t85MR4cAgzxaVYzn5+w5NHirqcbY2OZGRnzS09t3daSBfqvQ59kyLIExmWaop7wAfjtDPXZMo3dhXJJ3dJnMzOETkU1raKNntYuYxa2z28geF29PnniHhZ2Dup2jnsOhzLK64czb8uggG10tjF4lkFk0oWlEP4tcrIVWs4Z/haRvrIyb0bek3L8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABklzueAAAAYHRSTlP/////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGYnuuAAABvklEQVR42uWWV2/cMAyAKUrWsobn7ZG7y073+v8/rTzgmjp9qkOjQBH6xYThD9QHihLAvw3npiJJRDkNqUqzWVFNgqqxKNDHCUhGFxRo+CSlixliKrSaQDlRiFew1ZMo3QF0SLp4JKsvllpCWg4pptmvYgIWKbKcP3dUlRJyzAfE5z3jEANH+tCP1Rzx9adhtuKgNnmYLTgLbP7oVwbq2A+z/shAvV8Ps/UHBmq+PPxOvi3nHJQQ68sa+xshOKjPpSjF+u7h4Y5Ae/GFgToJirJc0nN++cHZz/Mz4hLlR9aQ6cUget7AehSXusr9I3ciPx1IVlnuD09TnF6n78cT/Afx2skcV9K9GC+L1atHhI3mBcruRp0PIYO0duuMBamgtmCDglsJ1sHWNCNI29RhVNpiaDVsPeBu4bOW6T7qnTFtGmGHDnXcmStAKRN41WAE6VB69/Wq0U7h36My0l2hWuUGaV3EUx5M7QsIqq4UhtCNMJXg1kesFvS3pZJMS3BLPL8BqlWO6AWJBp3TsNnAO0lczFm31x2YaweKvo3pBdc6kBmyBEWSQEVQKldU1bmrugkukxanuik3/h7edPwEbVkU4N7rmyAAAAAASUVORK5CYII=",
  AWALE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAAsCAMAAACqslFNAAABgFBMVEX9/fxKdktHaUfu1IH+5o745tXw2Mzxx7D06+axyLHR5tI5aTuTtZPL2cvstpSKqIvsqo701LdriG3799dxlnJNg1DSim3TlHG21bbW9Niou6jSp4/ruaY9d0PRiFU5dDrrmG9peWrReU3WnIT2xZjry8U8aULTx7nppXfpiG2Gmoa82MHYtJdBZj3u8o47XDtCdDqduKPc2JHd9+Tj233v57FIXUxdimFhiVhypXXavK7NyMXx9Ht7mYR+pYO8zMDconrE17yAmHuHoX255Le+4sTJfmfc5uDph1ns2uI/XUM+g0VGgDtfkV9gf19+s3+BsX+fw5+ew6S/e0Cgr52qr6bab0fLdTnclVjdr6LjbUvhclThjIHlkVvjnIUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACE14qGAAAAYHRSTlP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBzbeRDAAAFEUlEQVR42u2Y13bjNhCGCWxAsIK9SKRY1GXL3V73tb272ZLee/L+j5EBQdlyYl+Ix4UnJ3Nh49gk8fGfmX8gSdJzBSFSO0ORU9pONllWCE1oKzVTIKMnidw+tI+cidCItQ/NlInnyayw25RJhThQ/acTx6HUzlibql+epKkskfk8Te0wY3Jril8mRKZ24kjOIArDiA1h2RLNiAQJpUkie9S2U4c4SULaIRrHANlYROEX8eAHi1ohGzErhQhlIZPIhBDycZS0A00eQal5vNhCW1Em1KGjNIrkVqQyHRFoUchnNpClUcIYi97Z5HkTeTo6oQ7x0hSUomyaZdNEJukgDMNnJQPHgBilyZzIyYAx+zLsF8PpJfEcxp6g0Myuqna1+7wMRgCk8S/boyBUFL6z6XCaDb2nkcbCEOqd2QQy3gIwliIH2KIwocThaCtuoVqG1gStixHC8X02W4kH1Z94DnUAFexsuur4NOHdrSZoKqChu9CUkUCrjDaESQDtwNdFP11thzWMsNtENnXjHjQykavPAMSBaR4Sb84AjjI7y1brABOej7DxoKpNKLBBOKwI+wyKDXrUnmawXFU0QHM7D4gmnZw4DvdZbrSzgrOFs1l/VTIQzYcdxnWnaSaEUv8LYnFVtVC0C8syVG1vCe3mClWNtfrOUZJSiNSOsn5hz6jnJFE0XdXPzvFxJ8iDcS0b7zoksquUCJdmDQHFqKgufvkSegb55g2aKFJzDeHXho/LHXHrrwM4/th2kfX/ZPZs4HmS561qadCe65KB82D725oHI92/3lkXlO6GwW0Mrak7LkZ5fqjdRlOhJN54kuKOkV+9opxERVR8+O2nYji0Z9AJDUrZxa8gi+72F/lhp/bRIEfrfPUaoUBQajh4C4Ia1RUG6n2uf1ejbVdo62gDHfFFF/V04UMyjICsP7OdA44mN2oyzB9pbedIVxe1F1RaaQj1eqKWfsTW0mv7eqC/uqXauY70I0/crKPqBUjKhkMqK7LDGqK5WMhytL2N6mqDnZG7xxU45hCcslz2fA2NAyHNAg1eAuXf8LvfI3gZVRwdqXPAT0MTVvz+h9Jg1IChvV0343ipSVXuJaCVjzoG1NWXHSnGrrh8TzOt0oX/12jccj/l9cr19Uu3LFGAULe6ls6hRUcjOp9+6NuNRMNY/4y3nQ67iGrTYG8owBj05G6cx1B+FbQGLYDXupo1vkHrcTSVo/mxOjk9jWNVFT0Ln+zAZsFof/m5cBp5JpjRxcVEvXqDrk3D4ktQDJLoQ08cd1BZFWGJx1WyfB0tJXSdqxb08uO9f454aFKI7PuIrt6fmr91PdavOI9wgmpyWS4vPXC5PPha31lMDX/RBsa1BwKaAg2TB/+awrId9vv97LLJybGLsXkzr/SgVx9A/Gp07VSUeZD3KmIF8lxZSedoYXfdxaAyxteS35ryMNFZo+/TNHfLX0ou1+orTTgXkAkFLajBsQBe2wJbiSXNwLju0Oq8pgohYUZUtve+O1new2t2qrW29OUjqqvr+pYr7EHXax4V6z1hwOCruNfDbmkZ3Lz44RMesKFX/dixEN7Aru+7pWs+wPm5e/twGxuGYf1QLQ3LsISTafDHRaZMKwgCH1AMNzi0THGHUZNcGRZk3D3f0aRniY6m1f525xFK0/ae5BsxHo/68EaP9w52d3df7O/vv3ik4I+GLUgTtIPNzc2zs08eK87O4PmbB570f/z3428G12yXesxHywAAAABJRU5ErkJggg==",
  SMART_ENERGY: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAAAsCAMAAAC5ZRG5AAABgFBMVEX+/v7n5+fX2Ne3uLhnZ2eoqKjHx8h0qC51dXWWl5dXV1eHh4ft+dRJSUlymzHX5s+GqVPI2rF3mki2u8L11bTo6NByqhuNt1Cnx3S5ydDP5rF6pkZ2sSqcnaaXtmmovYyzyJKw2bq11saPrGqeoazW3OLl1M/05beCqDyWt4mSxKvH5ZuBhn2z3Xy43IrB2pLe4OXd8LDe9MznxZbly7fi97s3NzdfX2BzsRl/sUR2upSFc3aLfoCZuqCbscGio56is329zKK44oCj5Lq04szUmk3Eo1fftnbNvsDCz6/O9J7a9Ofm2+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABO0c/vAAAAYHRSTlP//////////////////////////////////////////////////////////////////////////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAAACl4YnGAAADsUlEQVR42u1Y13LrOAwlAIISyUiyXOKSuMTpt9ftvbf//54FSHlv8pL4zu6s/eBjzYiEAPIQACFaxhyw7zg6OtonNu3y/LzX693uDaPZeb8uBPVip35aLperNjNoE6Hj46IY75JS0+/3635vlZrqoUIYFZOdZk+vKE4lVEtjbvuJjuLpTvPnu/o0cWqPToriM+Ekt8lutxymcJ0eT2adh4p6vOsi0N7UmtPjpx2hB33kMmCLpbo7zYztOY1Wi/H4ZjL7fHxajMeT1w9ME2xGYOkBIqoQMTGETSPfvQWE/KDqrPCe8j2jfINRnkZzfPbiefvm+Q9/PFK3y9g1qALjhV+wlBiKPCrd4A1alUcMVQjBpukCbsxCXg6UIVPkLIBkI2sIqs9W3LQ4KerzWX3Sax/2Z2k3EdPRZCLwn3jQSWVUyFRjKb4BG9kCJC9+oATKRnTQl9oVzYo0GUIo1UU2Guul/ylLHdAKuXjfq+ubh73Urc7aiKb0eZZE0kfDURHQUso55vKfcFfZKjqb+pZKq7rWdgJfpTSj0gxkOArGfF/nUtQser3Xj+Sdxh7RxQCR71Bi76ro5RewpKzpP1AKhBlZuaSyZC9g13k9L0MoGcvGfmvMSiidvFD/PLb5mTat4KK/R8nnNNt4SURlWkGi1IUbs1OEUl5O2XlJiXQWZEm1m9XLl++32ptcsSNFrCAHDjeBo5DkATaUJL8cBZ8CJy2xcy50PuGkLJEMnUcrln4oNaEq/3E1TFye4TqPgU+UiCRQCrnjHd30FDZGlGfzLitHwM30nBUSOzD7gLwzNXAQ/F4wkk3mmX01N66y+3J2lEr1TLcw7YOPRub/O+nDNmk6wt/b2fW/4STvUb3kIOBQSg6owIB2nV6gAmOuhoKrswa/fmLMb4iU1AWiI8pA2pZBREjT9RqblsmxcxcOaWAGdInmErY9N3iU14YkosGIzIawZAaMAN75KHUBUtF7N/zl51+vf/zz7PaJwS+vnDdSlqLWJZa672UQudizWOBg8M20eSaVltzFqwtGmk/hgs1gTrRdMSAmZuFkkLQtHZaxpPh40gmk3LF03g3fvh2OzpqzL4TSV1fARusrs/iLFY51HAcxbX2YXnovnMEP5gxO3jLs5gNi3D5yEp48VD4OyTlHgiWFRS5984toNLy+VkrN+id5/peKRAXSaakzT3rYpDGn0zXhK4nq4BI0F6QE51T4j/9kfISuW6PZM2D7Zu++QYwOn2EOOOCAAw444B7+Bk90LzQbYrEPAAAAAElFTkSuQmCC",
};

/* ---------- Palette ERANOVE ---------- */
const NAVY = "#16213A";
const NAVY_2 = "#243456";
const VERT = "#8DB93F";
const VERT_F = "#4F7B14";
const VERT_P = "#EDF5DE";
const BLEU = "#2E6DA4";
const BLEU_P = "#E3EFFA";
const AMBRE = "#D9902B";
const AMBRE_P = "#FCF1DE";
const TERRE = "#C15A38";
const TERRE_P = "#FBE9E2";
const GRIS = "#8A909B";
const GRIS_P = "#F1F2F4";
const OR = "#E8B93C";

const INDICATEURS = [
  { code: "PCI", n: 1, court: "Plan de Contrôle Interne",
    libelle: "Taux de mise en œuvre du Plan de Contrôle Interne",
    num: "Nb activités réalisées", den: "Nb activités planifiées", objectif: 1.0, mode: "CUMUL" },
  { code: "CARTO", n: 2, court: "Cartographies de risques",
    libelle: "Taux de réalisation ou mise à jour des cartographies de risques",
    num: "Nb cartos réalisées ou mises à jour", den: "Nb cartos à réaliser ou mettre à jour", objectif: 0.5, mode: "CUMUL" },
  { code: "AMR", n: 3, court: "Actions de maîtrise",
    libelle: "Taux de mise en œuvre des actions de maîtrise des risques niveaux 1 & 2",
    num: "Nb reco. traitées à 100 %", den: "Nb reco. émises", objectif: 0.8, mode: "CUMUL" },
  { code: "QCI", n: 4, court: "QCI",
    libelle: "Taux de réalisation des Questionnaires de Contrôle Interne planifiés",
    num: "Nb QCI administrés", den: "Nb QCI planifiés", objectif: 0.6, mode: "CUMUL" },
  { code: "TCI", n: 5, court: "TCI",
    libelle: "Taux de réalisation des Tests de Contrôle Interne planifiés",
    num: "Nb TCI administrés", den: "Nb TCI planifiés", objectif: 1.0, mode: "CUMUL" },
  { code: "RECO_SEM", n: 6, court: "Reco. séminaires CI",
    libelle: "Taux de mise en œuvre des recommandations issues des séminaires / journées CI",
    num: "Nb reco. traitées à 100 %", den: "Nb reco. émises", objectif: 0.75, mode: "CUMUL" },
  { code: "RECO_CA", n: 7, court: "Reco. comités d'audit",
    libelle: "Taux de mise en œuvre des recommandations issues des comités d'audit",
    num: "Nb reco. traitées à 100 %", den: "Nb reco. émises", objectif: 1.0, mode: "CUMUL" },
];
const TOUS = INDICATEURS.map((i) => i.code);

/* 12 filiales déclarantes pour 11 entités juridiques — GS2E remonte par 2 sous-directions (RG-01 à RG-03) */
const FILIALES = [
  { code:"GS2E_SDCI", libelle:"GS2E — SDCI", ej:"GS2E", logo:"GS2E", corr:"K. Assamoi", mail:"k.assamoi@gs2e.ci", affectes:TOUS,
    profil:{ perf:.72, debut:1, trous:[], n1:.63 } },
  { code:"GS2E_SDRM", libelle:"GS2E — SDRM", ej:"GS2E", logo:"GS2E", corr:"H. M.", mail:"h.m@gs2e.ci", admin:true,
    affectes:["PCI","CARTO","AMR","RECO_SEM"],
    profil:{ perf:.70, debut:1, trous:[], n1:.60 } },
  { code:"CIE", libelle:"CIE", ej:"CIE", logo:"CIE", corr:"A. Koffi", mail:"a.koffi@cie.ci", affectes:TOUS,
    profil:{ perf:.93, debut:1, trous:[], n1:.86, sur:["RECO_SEM"] } },
  { code:"SODECI", libelle:"SODECI", ej:"SODECI", logo:"SODECI", corr:"M. Diomandé", mail:"m.diomande@sodeci.ci", affectes:TOUS,
    profil:{ perf:.84, debut:1, trous:[], n1:.79, creux:[4,5,6] } },
  { code:"KEKELI", libelle:"KEKELI", ej:"KEKELI", logo:"KEKELI", corr:"B. Ouattara", mail:"b.ouattara@kekeli.ci", affectes:TOUS,
    profil:{ perf:.66, debut:1, trous:[], n1:.58, denZero:{ TCI:[1,2] } } },
  { code:"CIPREL", libelle:"CIPREL", ej:"CIPREL", logo:"CIPREL", corr:"S. N'Guessan", mail:"s.nguessan@ciprel.ci", affectes:TOUS,
    profil:{ perf:.74, debut:1, trous:[], n1:.71 } },
  { code:"ATINKOU", libelle:"ATINKOU", ej:"ATINKOU", logo:"ATINKOU", corr:"R. Bamba", mail:"r.bamba@atinkou.ci", affectes:TOUS,
    profil:{ perf:.61, debut:3, trous:[], n1:.52 } },
  { code:"ASOKH", libelle:"ASOKH", ej:"ASOKH", logo:"ASOKH", corr:"L. Traoré", mail:"l.traore@asokh.ci", affectes:TOUS,
    profil:{ perf:.69, debut:1, trous:[5], n1:.64 } },
  { code:"SDER", libelle:"SDER", ej:"SDER", logo:"SDER", corr:"P. Yao", mail:"p.yao@sder.ci", affectes:TOUS,
    profil:{ perf:.47, debut:1, trous:[], n1:.44, reperdu:"AMR" } },
  { code:"OMILAYE", libelle:"OMILAYE", ej:"OMILAYE", logo:"OMILAYE", corr:"F. Kouassi", mail:"f.kouassi@omilaye.ci", affectes:TOUS,
    profil:{ perf:.44, debut:1, trous:[8], n1:.41, objSpec:{ PCI:0.8 } } },
  { code:"AWALE", libelle:"AWALE", ej:"AWALE", logo:"AWALE", corr:"D. Coulibaly", mail:"d.coulibaly@awale.ci", affectes:TOUS,
    profil:{ perf:.58, debut:4, trous:[], n1:null } },
  { code:"SMART_ENERGY", libelle:"SMART ENERGY", ej:"SMART ENERGY", logo:"SMART_ENERGY", corr:"N. Aké", mail:"n.ake@smartenergy.ci", affectes:TOUS,
    profil:{ perf:.88, debut:1, trous:[], n1:.81 } },
];

const MOIS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const MOIS_LONG = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const EXERCICE = 2026;              // exercice courant
const DERNIER_MOIS = 8;             // août 2026, période ouverte jusqu'au 10 septembre
const EXERCICES = [2026, 2025];     // exercices disponibles — 2024 n'existe pas (RG-28)
const derniersMoisDe = (a) => (a === EXERCICE ? DERNIER_MOIS : 12);

/* ---------- Générateur déterministe, cumuls monotones (RG-46) ----------
   Fonction de hachage FNV et série identiques à V3 et V4 : les chiffres
   affichés ici coïncident exactement avec ceux du dashboard consolidé. */
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }

function serie(filiale, ind, annee) {
  const p = filiale.profil;
  const nMois = annee === EXERCICE ? DERNIER_MOIS : 12;
  const base = annee === EXERCICE ? p.perf : p.n1;
  if (base === null || base === undefined) return null;      // pas d'historique (RG-28)

  const jitter = (hash(filiale.code + ind.code + annee) - 0.5) * 0.16;
  const cible = Math.max(0.12, Math.min(1.18, base + jitter));
  const out = [];

  for (let m = 1; m <= nMois; m++) {
    if (annee === EXERCICE && m < p.debut) { out.push(null); continue; }
    if (annee === EXERCICE && p.trous?.includes(m)) { out.push(null); continue; }
    if (annee === EXERCICE && p.denZero?.[ind.code]?.includes(m)) { out.push({ nc: true }); continue; }

    const avance = m / nMois;
    let t = cible * (0.34 + 0.66 * avance);
    if (annee === EXERCICE && p.creux?.includes(m)) t *= 0.72;
    if (annee === EXERCICE && p.sur?.includes(ind.code) && m >= 6) t = Math.min(1.35, t * 1.32);
    if (annee === EXERCICE && p.reperdu === ind.code) {
      t = m <= 5 ? Math.max(t, ind.objectif + 0.04) : ind.objectif - 0.13 - 0.01 * m;
    }
    const den = Math.max(2, Math.round(4 + 9 * hash(filiale.code + ind.code + "d") + m * 0.55));
    out.push({ taux: Math.max(0, t), num: Math.round(t * den), den });
  }
  return out;
}

const pct = (t, d = 1) => (t * 100).toFixed(d).replace(".", ",") + " %";

/* L'objectif est porté par l'affectation : filiale × indicateur × exercice (RG-23).
   L'objectif spécifique d'OMILAYE sur PCI n'a été ouvert qu'au titre de 2026. */
const objectifDe = (filiale, ind, annee) =>
  (annee === EXERCICE ? filiale.profil.objSpec?.[ind.code] : undefined) ?? ind.objectif;

/* ---------- Échelle chromatique : position du taux par rapport à son objectif ---------- */
function couleurs(taux, objectif) {
  if (taux == null) return { bg: GRIS_P, fg: GRIS, bd: "#E2E4E8" };
  if (taux > 1) return { bg: BLEU_P, fg: "#1B547F", bd: "#B4D3EC" };
  const r = objectif > 0 ? taux / objectif : 0;
  if (r >= 1) return { bg: VERT_P, fg: VERT_F, bd: "#CBE3A6" };
  if (r >= 0.85) return { bg: "#F6F7E6", fg: "#7A7A16", bd: "#E4E7BE" };
  if (r >= 0.6) return { bg: AMBRE_P, fg: "#96601A", bd: "#F0D6A4" };
  return { bg: TERRE_P, fg: "#98422A", bd: "#F0C7B8" };
}

/* ============================================================
   Couche traçabilité — auteurs, horodatages, modifications (RG-35, RG-36)
   ============================================================ */

/* Commentaires de saisie obligatoires (RG-37). Trois variantes par indicateur,
   sélectionnées de façon déterministe pour rester stables d'un affichage à l'autre. */
const COMMENTAIRES = {
  PCI: [
    "Poursuite du déploiement du plan. Les activités du mois ont été menées conformément au calendrier validé.",
    "Deux activités reportées faute de disponibilité des équipes opérationnelles. Rattrapage engagé sur le mois suivant.",
    "Les activités portant sur le processus achats ont été clôturées. Avancement conforme à la trajectoire.",
  ],
  CARTO: [
    "Mise à jour de la cartographie du processus exploitation achevée et validée en comité de direction.",
    "Atelier de revue des risques tenu avec les métiers. La formalisation reste à finaliser sur deux processus.",
    "Aucune nouvelle cartographie clôturée ce mois. Les travaux sur le processus trésorerie se poursuivent.",
  ],
  AMR: [
    "Traitement des actions de niveau 1 achevé sur le périmètre exploitation. Les niveaux 2 progressent.",
    "Le périmètre a été élargi par de nouvelles recommandations, ce qui ralentit mécaniquement le taux.",
    "Trois actions clôturées à 100 % et documentées. Les preuves ont été versées au dossier.",
  ],
  QCI: [
    "Questionnaires administrés auprès des directions opérationnelles. Dépouillement en cours.",
    "Campagne décalée en raison de l'indisponibilité de deux directions. Reprogrammation actée.",
    "Taux de retour satisfaisant sur la campagne du mois. Les écarts relevés alimentent le plan d'action.",
  ],
  TCI: [
    "Tests réalisés sur les contrôles clés du cycle achats. Conclusions consignées dans le rapport joint.",
    "Deux tests planifiés n'ont pu être menés, les pièces justificatives n'étant pas disponibles.",
    "L'ensemble des tests du mois a été exécuté. Aucun contrôle clé défaillant n'a été identifié.",
  ],
  RECO_SEM: [
    "Recommandations du séminaire annuel traitées à 100 % sur le volet organisation.",
    "Avancement soutenu. Les recommandations restantes dépendent d'arbitrages en cours à la direction générale.",
    "Deux recommandations supplémentaires ont été clôturées et validées par le référent contrôle interne.",
  ],
  RECO_CA: [
    "Suivi des recommandations du comité d'audit. Les échéances du trimestre ont été tenues.",
    "Une recommandation reste ouverte dans l'attente de la refonte du référentiel de délégation.",
    "Clôture de la recommandation relative à la séparation des tâches, preuve à l'appui.",
  ],
};
const COMMENTAIRE_DEN_ZERO = "Aucun test n'était planifié sur la période. Le dénominateur est nul : la valeur est non calculable et exclue des moyennes, elle n'est pas assimilée à 0 %.";

/* ---------- Brouillons : valeurs saisies, commentaire manquant (RG-37, RG-37 bis) ----------
   Un indicateur n'est *renseigné* que si numérateur, dénominateur ET commentaire sont fournis.
   La valeur existe et s'affiche, mais l'indicateur n'est pas compté dans le taux de remontée.
   Référentiel commun avec l'écran V7 — toute modification doit être répercutée sur les deux. */
const BROUILLONS = {
  "CIPREL|2026|6": ["QCI", "TCI"],
  "KEKELI|2026|7": ["RECO_CA"],
  "GS2E_SDCI|2026|8": ["CARTO", "QCI", "RECO_SEM"],
  "SODECI|2026|8": ["TCI", "RECO_CA"],
  "SMART_ENERGY|2026|8": ["RECO_CA"],
  "SDER|2026|8": ["PCI", "CARTO", "AMR", "QCI"],
  "CIE|2025|11": ["TCI"],
};
const estBrouillon = (fil, ind, mois, annee) =>
  (BROUILLONS[`${fil.code}|${annee}|${mois}`] || []).includes(ind.code);

/* Pièces jointes types par indicateur (RG-38, RG-39) */
const PJ_TYPES = {
  PCI: [["Suivi_plan_controle_interne", "xlsx"], ["PV_comite_pilotage", "pdf"]],
  CARTO: [["Cartographie_risques_MAJ", "pdf"], ["Atelier_revue_risques", "pptx"]],
  AMR: [["Suivi_actions_maitrise", "xlsx"], ["Preuves_cloture_actions", "pdf"]],
  QCI: [["Synthese_campagne_QCI", "pdf"], ["Depouillement_QCI", "xlsx"]],
  TCI: [["Rapport_tests_controle_interne", "docx"], ["Feuilles_de_test", "xlsx"]],
  RECO_SEM: [["Suivi_reco_seminaire_CI", "xlsx"], ["Note_cloture_reco", "docx"]],
  RECO_CA: [["Suivi_reco_comite_audit", "pdf"], ["Extrait_PV_comite_audit", "pdf"]],
};
const COULEUR_EXT = { pdf: TERRE, xlsx: VERT_F, docx: BLEU, pptx: AMBRE, png: GRIS, jpg: GRIS };

/* Réouvertures de période décidées par le Directeur (RG-31) */
const REOUVERTURES = {
  "SODECI|2026|5": { motif: "Erreur de dénominateur signalée par le correspondant : le périmètre des activités planifiées avait été sous-estimé de quatre unités.",
                     par: "Directeur CI Groupe", date: "22 juin 2026", jusquau: "30 juin 2026" },
  "ATINKOU|2026|3": { motif: "Première remontée de la filiale après intégration au dispositif. Délai supplémentaire accordé pour la saisie initiale.",
                      par: "Directeur CI Groupe", date: "18 avril 2026", jusquau: "25 avril 2026" },
};

/* Métadonnées d'une saisie : auteur, horodatage, modification éventuelle */
function metaSaisie(fil, ind, mois, annee) {
  const jour = 1 + Math.floor(hash(fil.code + ind.code + mois + annee + "j") * 10);
  const heure = 8 + Math.floor(hash(fil.code + ind.code + mois + "h") * 10);
  const minute = Math.floor(hash(fil.code + ind.code + mois + "m") * 60);
  const moisS = mois === 12 ? 0 : mois;            // index du mois M+1
  const anneeS = mois === 12 ? annee + 1 : annee;
  const modifie = hash(fil.code + ind.code + mois + "mod") > 0.80;
  const jourM = Math.min(10, jour + 2);
  const reouv = REOUVERTURES[`${fil.code}|${annee}|${mois}`];
  return {
    auteur: fil.corr,
    date: `${jour} ${MOIS_LONG[moisS].toLowerCase()} ${anneeS}`,
    heure: `${String(heure).padStart(2, "0")}h${String(minute).padStart(2, "0")}`,
    modifie,
    dateModif: modifie ? `${jourM} ${MOIS_LONG[moisS].toLowerCase()} ${anneeS}` : null,
    reouverture: reouv || null,
    commentaire: null,
  };
}

function commentaireSaisie(fil, ind, mois, point) {
  if (point && point.nc) return COMMENTAIRE_DEN_ZERO;
  if (fil.profil.reperdu === ind.code && mois >= 6)
    return "Quatre recommandations supplémentaires ont été émises à l'issue du comité de mai. Le numérateur progresse, mais moins vite que le périmètre : le taux repasse sous l'objectif.";
  if (fil.profil.sur?.includes(ind.code) && mois >= 6)
    return "Des recommandations issues de l'exercice précédent ont été clôturées et intégrées au numérateur. Le taux dépasse 100 %, sans plafonnement.";
  const v = COMMENTAIRES[ind.code];
  return v[Math.floor(hash(fil.code + ind.code + mois + "c") * v.length) % v.length];
}

function piecesJointes(fil, ind, mois, annee, meta) {
  const h = hash(fil.code + ind.code + mois + annee + "pj");
  if (h < 0.42) return [];
  const modeles = PJ_TYPES[ind.code];
  const n = h > 0.86 ? 2 : 1;
  return modeles.slice(0, n).map(([nom, ext], i) => ({
    nom: `${nom}_${MOIS[mois - 1]}${annee}.${ext}`,
    ext,
    taille: (0.3 + hash(fil.code + ind.code + mois + i + "t") * 6.4).toFixed(1).replace(".", ",") + " Mo",
    par: meta.auteur,
    date: meta.date,
  }));
}

/* ---------- Fils de commentaires par filiale × indicateur × exercice (RG-41 à RG-45) ---------- */
const FILS = {
  "SDER|AMR|2026": [
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "12 juin 2026 · 09h14", t: "Le taux repasse sous l'objectif depuis juin alors qu'il était atteint en avril. Le dénominateur a-t-il augmenté à la suite du comité de mai ?" },
    { a: "P. Yao", r: "CORRESPONDANT", d: "13 juin 2026 · 15h02", t: "Confirmé : quatre recommandations supplémentaires ont été émises. Le numérateur progresse mais moins vite que le périmètre. Un plan de rattrapage est engagé sur le troisième trimestre." },
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "14 juin 2026 · 08h40", t: "Bien noté. Merci de joindre le plan de rattrapage à la saisie de juillet, avec les échéances par action." },
  ],
  "OMILAYE|PCI|2026": [
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "3 mars 2026 · 11h25", t: "Objectif spécifique abaissé à 80 % pour l'exercice 2026, compte tenu de la mise en place récente du dispositif de contrôle interne sur cette entité." },
    { a: "F. Kouassi", r: "CORRESPONDANT", d: "3 mars 2026 · 16h48", t: "Bien reçu. La trajectoire est bâtie sur cette cible ; un retour à l'objectif groupe est visé à compter de 2027." },
  ],
  "OMILAYE|CARTO|2026": [
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "9 septembre 2026 · 07h55", t: "Le mois d'août n'est pas remonté et la période se clôture demain. Merci de régulariser avant le délai." },
  ],
  "CIE|RECO_SEM|2026": [
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "8 juillet 2026 · 10h30", t: "Le taux dépasse 100 %. Aucun plafonnement n'est appliqué, mais je souhaite m'assurer de la cohérence entre le numérateur et le dénominateur retenus." },
    { a: "A. Koffi", r: "CORRESPONDANT", d: "8 juillet 2026 · 14h12", t: "Des recommandations issues du séminaire 2025 ont été clôturées cette année et comptabilisées au numérateur, alors que le dénominateur ne porte que les recommandations 2026. Je propose de rebaser le dénominateur à l'ouverture de l'exercice 2027." },
  ],
  "KEKELI|TCI|2026": [
    { a: "B. Ouattara", r: "CORRESPONDANT", d: "6 février 2026 · 09h05", t: "Aucun test n'était planifié en janvier ni en février, le programme démarrant en mars. Les saisies sont donc à dénominateur nul." },
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "7 février 2026 · 08h20", t: "Traitement conforme : le taux est non calculable et exclu des moyennes, il n'est pas compté comme 0 %." },
  ],
  "ASOKH|PCI|2026": [
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "15 juin 2026 · 09h10", t: "Le mois de mai est absent pour l'ensemble de vos indicateurs. La courbe est interrompue et aucune valeur n'est reportée. Merci d'indiquer la cause." },
    { a: "L. Traoré", r: "CORRESPONDANT", d: "16 juin 2026 · 11h33", t: "Absence du référent contrôle interne sur la période de saisie. Une demande de réouverture de la période sera adressée." },
  ],
  "SODECI|PCI|2026": [
    { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "20 juin 2026 · 16h05", t: "Le creux du deuxième trimestre est marqué sur l'ensemble de vos indicateurs. Est-ce imputable au dénominateur ou à un ralentissement réel des travaux ?" },
    { a: "M. Diomandé", r: "CORRESPONDANT", d: "21 juin 2026 · 09h47", t: "Ralentissement réel, lié à la mobilisation des équipes sur le déploiement du nouveau système d'exploitation. Le redressement est amorcé depuis juillet." },
  ],
};

/* Événements journalisés hors saisie (RG-24, RG-31) */
const EVENEMENTS = {
  OMILAYE: [
    { type: "OBJECTIF", d: "3 mars 2026 · 11h20", par: "Directeur CI Groupe",
      t: "Objectif de l'affectation OMILAYE × Plan de Contrôle Interne modifié pour l'exercice 2026.",
      avant: "100 %", apres: "80 %" },
  ],
};

/* ============================================================
   Graphique SVG, sans dépendance de charting
   ============================================================ */
function Courbe({ pts, ptsN1, objectif, objectifGroupe, annee, hauteur = 150 }) {
  const W = 580, H = hauteur, ML = 40, MR = 14, MT = 12, MB = 22;
  const iw = W - ML - MR, ih = H - MT - MB;
  const nOuvert = derniersMoisDe(annee);
  const derogation = objectifGroupe != null && objectifGroupe !== objectif;

  const vals = [...(pts || []), ...(ptsN1 || [])].filter((p) => p && p.taux != null).map((p) => p.taux);
  const hi = Math.max(1.05, objectif + 0.1, derogation ? objectifGroupe + 0.1 : 0,
                      ...(vals.length ? vals : [1])) * 1.04;
  const x = (m) => ML + (iw * (m - 1)) / 11;
  const y = (t) => MT + ih - (ih * t) / hi;

  /* La courbe s'interrompt sur un trou ou un point non calculable — aucune interpolation (RG-32) */
  const segments = [];
  let cur = [];
  (pts || []).forEach((p, i) => {
    if (p && p.taux != null) cur.push([x(i + 1), y(p.taux)]);
    else { if (cur.length > 1) segments.push(cur); cur = []; }
  });
  if (cur.length > 1) segments.push(cur);

  const ligneN1 = (ptsN1 || [])
    .map((p, i) => (p && p.taux != null ? `${x(i + 1)},${y(p.taux)}` : null))
    .filter(Boolean).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {annee === EXERCICE && (
        <rect x={x(nOuvert)} y={MT} width={W - MR - x(nOuvert)} height={ih} fill="#F8F9FB" />
      )}

      {[0, 0.25, 0.5, 0.75, 1].map((g) => {
        const t = hi * g;
        return (
          <g key={g}>
            <line x1={ML} x2={W - MR} y1={y(t)} y2={y(t)} stroke="#EDEFF2" strokeWidth="1" />
            <text x={ML - 6} y={y(t) + 3.5} textAnchor="end" fontSize="9" fill={GRIS}>{Math.round(t * 100)}%</text>
          </g>
        );
      })}

      {derogation && (
        <g>
          <line x1={ML} x2={W - MR} y1={y(objectifGroupe)} y2={y(objectifGroupe)}
                stroke="#B9BFC9" strokeWidth="1.3" strokeDasharray="2 3" />
          <text x={ML + 3} y={y(objectifGroupe) - 4} fontSize="9" fill={GRIS}>
            objectif groupe {Math.round(objectifGroupe * 100)} %
          </text>
        </g>
      )}

      <line x1={ML} x2={W - MR} y1={y(objectif)} y2={y(objectif)}
            stroke={VERT_F} strokeWidth="1.6" strokeDasharray="5 4" />
      <text x={W - MR} y={y(objectif) - 5} textAnchor="end" fontSize="9.5" fill={VERT_F} fontWeight="700">
        objectif {derogation ? "dérogatoire " : ""}{Math.round(objectif * 100)} %
      </text>

      {MOIS.map((m, i) => (
        <text key={m} x={x(i + 1)} y={H - 6} textAnchor="middle" fontSize="9"
              fill={i + 1 <= nOuvert ? GRIS : "#C9CDD5"}>{m}</text>
      ))}

      {ligneN1 && <polyline points={ligneN1} fill="none" stroke="#C3C8D1" strokeWidth="1.8" strokeDasharray="4 3" />}

      {segments.map((s, i) => (
        <polyline key={i} points={s.map((p) => p.join(",")).join(" ")} fill="none"
                  stroke={BLEU} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {(pts || []).map((p, i) => {
        if (!p) return <circle key={i} cx={x(i + 1)} cy={y(0)} r="2" fill="#E4E7EC" />;
        if (p.nc) return <text key={i} x={x(i + 1)} y={MT + ih / 2} textAnchor="middle" fontSize="9" fill={GRIS}>n/a</text>;
        const atteint = p.taux >= objectif;
        return <circle key={i} cx={x(i + 1)} cy={y(p.taux)} r="3.6"
                       fill={atteint ? VERT : "#FFFFFF"} stroke={atteint ? VERT_F : BLEU} strokeWidth="2" />;
      })}
    </svg>
  );
}

/* ============================================================ */
export default function DetailParFilialeDCI() {
  const [annee, setAnnee] = useState(EXERCICE);
  const [filialeCode, setFilialeCode] = useState("SDER");
  const [moisRef, setMoisRef] = useState(DERNIER_MOIS);
  const [compareN1, setCompareN1] = useState(true);
  const [panneau, setPanneau] = useState({});          // { "FIL|IND": "HIST" | "PJ" | "COM" }
  const [histComplet, setHistComplet] = useState({});  // historique déroulé sur tout l'exercice
  const [messages, setMessages] = useState({});        // messages publiés en séance
  const [brouillon, setBrouillon] = useState({});
  const [reouvrir, setReouvrir] = useState(false);
  const [reouvMois, setReouvMois] = useState(5);
  const [reouvMotif, setReouvMotif] = useState("");
  const [reouvFaites, setReouvFaites] = useState([]);

  const filiale = FILIALES.find((f) => f.code === filialeCode);
  const nOuvert = derniersMoisDe(annee);
  const moisEffectif = Math.min(moisRef, nOuvert);
  const anneeN1 = annee - 1;
  const n1Disponible = EXERCICES.includes(anneeN1);

  const indicateurs = useMemo(
    () => INDICATEURS.filter((i) => filiale.affectes.includes(i.code)), [filiale]);

  /* --- Séries et dérivations par indicateur --- */
  const data = useMemo(() => indicateurs.map((ind) => {
    const s = serie(filiale, ind, annee);
    const n1 = n1Disponible ? serie(filiale, ind, anneeN1) : null;
    const obj = objectifDe(filiale, ind, annee);
    const objGroupe = ind.objectif;                         // objectif de référence du référentiel
    const objN1 = n1Disponible ? objectifDe(filiale, ind, anneeN1) : null;
    const derogatoire = obj !== objGroupe;                  // le Directeur a modifié l'objectif de l'affectation
    const objDifferentN1 = n1 != null && objN1 != null && objN1 !== obj;
    const specifique = derogatoire;

    if (!s) return { ind, s: null, n1, obj, objGroupe, objN1, derogatoire, objDifferentN1, specifique, sansDonnees: true };

    const moisDernier = s.map((p, i) => (p && p.taux != null ? i + 1 : null)).filter(Boolean).pop() || null;
    const dernier = moisDernier ? s[moisDernier - 1] : null;
    const auMoisRef = s[moisEffectif - 1] || null;
    const premier = s.findIndex((p) => p && p.taux != null && p.taux >= obj);
    const n1Meme = moisDernier && n1 ? n1[moisDernier - 1] : null;

    /* Traçabilité : une ligne par mois attendu jusqu'au dernier mois ouvert */
    const lignes = [];
    for (let m = 1; m <= nOuvert; m++) {
      const p = s[m - 1];
      const cle = `${filiale.code}|${annee}|${m}`;
      if (p == null) {
        lignes.push({ m, etat: "NON_SAISI", reouverture: REOUVERTURES[cle] || null });
        continue;
      }
      const meta = metaSaisie(filiale, ind, m, annee);
      const brouillon = estBrouillon(filiale, ind, m, annee);
      lignes.push({
        m, etat: p.nc ? "NON_CALCULABLE" : "OK", p, meta, brouillon,
        commentaire: brouillon ? null : commentaireSaisie(filiale, ind, m, p),
        pj: brouillon ? [] : piecesJointes(filiale, ind, m, annee, meta),
      });
    }

    const brouillonRef = estBrouillon(filiale, ind, moisEffectif, annee);
    const renseigneRef = auMoisRef != null && !brouillonRef;
    const brouillonsExercice = lignes.filter((l) => l.brouillon).map((l) => l.m);

    return {
      ind, s, n1, obj, objGroupe, objN1, derogatoire, objDifferentN1, specifique, sansDonnees: false,
      moisDernier, dernier, auMoisRef, lignes, brouillonRef, renseigneRef, brouillonsExercice,
      premierFranchissement: premier >= 0 ? premier + 1 : null,
      ecartN1: dernier && n1Meme && n1Meme.taux != null ? (dernier.taux - n1Meme.taux) * 100 : null,
      nbPJ: lignes.reduce((a, l) => a + (l.pj ? l.pj.length : 0), 0),
    };
  }), [filiale, indicateurs, annee, moisEffectif, nOuvert, n1Disponible, anneeN1]);

  /* --- Score de la filiale au mois de référence (RG-17) --- */
  const scoreDe = (f, m, a) => {
    const vals = INDICATEURS.filter((i) => f.affectes.includes(i.code)).map((ind) => {
      const s = serie(f, ind, a);
      const p = s ? s[m - 1] : null;
      return p && p.taux != null ? p.taux : null;
    }).filter((v) => v != null);
    return vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : null;
  };

  const score = scoreDe(filiale, moisEffectif, annee);
  const classement = useMemo(() => FILIALES
    .map((f) => ({ f, s: scoreDe(f, moisEffectif, annee) }))
    .filter((r) => r.s != null)
    .sort((a, b) => b.s - a.s), [moisEffectif, annee]);
  const rang = classement.findIndex((r) => r.f.code === filialeCode);
  const moyenneGroupe = classement.length
    ? classement.reduce((a, r) => a + r.s, 0) / classement.length : null;

  const renseignes = data.filter((d) => !d.sansDonnees && d.renseigneRef).length;
  const brouillonsRef = data.filter((d) => !d.sansDonnees && d.brouillonRef).length;
  const atteints = data.filter((d) => !d.sansDonnees && d.auMoisRef && d.auMoisRef.taux != null
                                      && d.auMoisRef.taux >= d.obj).length;
  const attendus = indicateurs.length;

  /* --- Journal des événements de la filiale (RG-24, RG-31, RG-36) --- */
  const journal = useMemo(() => {
    const ev = [];
    ev.push({ type: "EXERCICE", d: `2 janvier ${annee} · 08h00`, par: "Directeur CI Groupe",
              t: `Ouverture de l'exercice ${annee} — ${attendus} affectations générées pour ${filiale.libelle}, objectifs initialisés à partir du référentiel groupe.` });
    (EVENEMENTS[filiale.code] || []).filter(() => annee === EXERCICE).forEach((e) => ev.push(e));
    Object.entries(REOUVERTURES).forEach(([cle, r]) => {
      const [fc, an, m] = cle.split("|");
      if (fc === filiale.code && Number(an) === annee)
        ev.push({ type: "REOUVERTURE", d: r.date, par: r.par,
                  t: `Réouverture de la période ${MOIS_LONG[Number(m) - 1].toLowerCase()} ${an}, jusqu'au ${r.jusquau}.`,
                  motif: r.motif });
    });
    reouvFaites.filter((r) => r.filiale === filiale.code && r.annee === annee).forEach((r) =>
      ev.push({ type: "REOUVERTURE", d: r.date, par: "Directeur CI Groupe",
                t: `Réouverture de la période ${MOIS_LONG[r.mois - 1].toLowerCase()} ${r.annee}.`,
                motif: r.motif, nouveau: true }));
    data.filter((d) => !d.sansDonnees).forEach((d) =>
      (d.lignes || []).filter((l) => l.meta && l.meta.modifie).slice(0, 2).forEach((l) =>
        ev.push({ type: "MODIFICATION", d: `${l.meta.dateModif} · ${l.meta.heure}`, par: l.meta.auteur,
                  t: `Modification de la saisie ${MOIS_LONG[l.m - 1].toLowerCase()} — ${d.ind.court}. Valeurs avant et après conservées au journal d'audit.` })));
    return ev;
  }, [filiale, annee, data, attendus, reouvFaites]);

  const publier = (cle) => {
    const t = (brouillon[cle] || "").trim();
    if (!t) return;
    setMessages((m) => ({ ...m, [cle]: [...(m[cle] || []),
      { a: "Directeur CI Groupe", r: "DIRECTEUR", d: "aujourd'hui · à l'instant", t, nouveau: true }] }));
    setBrouillon((b) => ({ ...b, [cle]: "" }));
  };

  const confirmerReouverture = () => {
    if (!reouvMotif.trim()) return;
    setReouvFaites((r) => [...r, { filiale: filiale.code, annee, mois: reouvMois,
      motif: reouvMotif.trim(), date: "aujourd'hui · à l'instant" }]);
    setReouvMotif(""); setReouvrir(false);
  };

  const basculer = (cle, onglet) =>
    setPanneau((p) => ({ ...p, [cle]: p[cle] === onglet ? null : onglet }));

  return (
    <div style={{ background: "#EFF1F5", minHeight: "100vh", fontFamily: "Arial, Helvetica, sans-serif", color: NAVY }}>

      <div style={{ background: "#FDF3E2", borderBottom: "1px solid #F2D9A8", color: "#8A5A12",
                    fontSize: 12, padding: "7px 24px" }}>
        <strong>Environnement de démonstration</strong> — toutes les données affichées sont fictives.
        Aucune donnée réelle du groupe ERANOVE n'est hébergée.
      </div>

      {/* En-tête */}
      <header style={{ background: `linear-gradient(100deg, ${NAVY} 0%, ${NAVY_2} 62%, #2C4066 100%)`,
                       padding: "18px 24px 20px", color: "#FFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ background: "#FFF", borderRadius: 7, padding: "7px 11px", display: "flex" }}>
            <img src={LOGOS.ERANOVE} alt="ERANOVE" style={{ height: 30 }} />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -.2 }}>
              Tableau de bord Contrôle Interne Groupe
            </div>
            <div style={{ fontSize: 12.5, color: "#AEBBD4", marginTop: 3 }}>
              Détail par filiale · fiche complète et traçabilité · Exercice {annee}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.22)",
                        borderRadius: 8, padding: "9px 15px", lineHeight: 1.4 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Directeur Contrôle Interne Groupe</div>
            <div style={{ fontSize: 11.5, color: "#AEBBD4" }}>
              Accès complet · 12 filiales
              <span style={{ marginLeft: 6, background: "rgba(232,185,60,.2)", color: OR,
                             border: `1px solid ${OR}55`, borderRadius: 4, padding: "1px 5px",
                             fontSize: 10, fontWeight: 700 }}>ADMIN</span>
            </div>
          </div>
        </div>
      </header>

      {/* Onglets */}
      <nav style={{ background: "#FFF", borderBottom: "1px solid #E1E5EB", padding: "0 24px",
                    display: "flex", gap: 2, overflowX: "auto" }}>
        {["Dashboard consolidé","Détail par filiale","Détail par indicateur","Suivi des remontées","Paramétrage","Journal d'audit"]
          .map((t, i) => (
          <div key={t} style={{ padding: "12px 15px", fontSize: 13, whiteSpace: "nowrap",
            fontWeight: i === 1 ? 700 : 400, color: i === 1 ? NAVY : "#8A909B",
            borderBottom: i === 1 ? `2.5px solid ${VERT}` : "2.5px solid transparent" }}>{t}</div>
        ))}
      </nav>

      {/* Sélecteur de filiale */}
      <div style={{ background: "#E7EBF1", borderBottom: "1px solid #D6DCE5", padding: "9px 24px",
                    display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
        <span style={{ color: "#5B6473", fontWeight: 700, letterSpacing: .3,
                       textTransform: "uppercase", fontSize: 10.5, marginRight: 4 }}>
          Filiale déclarante
        </span>
        {FILIALES.map((f) => (
          <button key={f.code} onClick={() => { setFilialeCode(f.code); setPanneau({}); setReouvrir(false); }}
            style={{ border: `1px solid ${f.code === filialeCode ? NAVY : "#C6CDD8"}`,
                     background: f.code === filialeCode ? NAVY : "#FFFFFF",
                     color: f.code === filialeCode ? "#FFF" : "#4A5261", borderRadius: 5,
                     padding: "4px 9px", fontSize: 11, cursor: "pointer",
                     fontWeight: f.code === filialeCode ? 700 : 400 }}>{f.libelle}</button>
        ))}
      </div>

      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 24px 60px" }}>

        {/* Barre de filtres — le sélecteur d'exercice manquait à V4 (RG-27) */}
        <section style={{ background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          padding: "13px 18px", display: "flex", gap: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
          <Champ label="Exercice">
            <select value={annee} onChange={(e) => { const a = Number(e.target.value);
                     setAnnee(a); setMoisRef(derniersMoisDe(a)); setPanneau({}); }}
                    style={{ ...selectStyle, minWidth: 120, fontWeight: 700 }}>
              {EXERCICES.map((a) => (
                <option key={a} value={a}>{a}{a === EXERCICE ? " — en cours" : " — clos"}</option>
              ))}
            </select>
          </Champ>
          <Champ label="Mois de référence">
            <select value={moisEffectif} onChange={(e) => setMoisRef(Number(e.target.value))} style={selectStyle}>
              {MOIS_LONG.map((m, i) => (
                <option key={m} value={i + 1} disabled={i + 1 > nOuvert}>
                  {m} {annee}{i + 1 > nOuvert ? " — non ouvert" : ""}
                </option>
              ))}
            </select>
          </Champ>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer",
                          background: "#F6F8FA", border: "1px solid #E1E5EB", borderRadius: 7, padding: "9px 13px" }}>
            <input type="checkbox" checked={compareN1} onChange={(e) => setCompareN1(e.target.checked)} />
            Comparer à {anneeN1}
          </label>
          <div style={{ flex: 1 }} />
          {annee === EXERCICE ? (
            <div style={{ background: VERT_P, border: "1px solid #CBE3A6", color: VERT_F, borderRadius: 7,
                          padding: "8px 13px", fontSize: 12 }}>
              Période <strong>{MOIS_LONG[nOuvert - 1].toLowerCase()}</strong> ouverte jusqu'au 10 septembre
            </div>
          ) : (
            <div style={{ background: GRIS_P, border: "1px solid #DDE0E5", color: "#5B6473", borderRadius: 7,
                          padding: "8px 13px", fontSize: 12 }}>
              Exercice <strong>clos</strong> — données figées, lecture seule
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Bouton>Export PDF</Bouton>
            <Bouton>Export Excel</Bouton>
          </div>
        </section>

        {!n1Disponible && compareN1 && (
          <Bandeau couleur={GRIS} fond={GRIS_P} bordure="#DDE0E5">
            Aucun exercice {anneeN1} n'existe dans le dispositif : la comparaison affiche « non disponible ».
            Aucune valeur n'est extrapolée.
          </Bandeau>
        )}
        {n1Disponible && compareN1 && filiale.profil.n1 === null && (
          <Bandeau couleur={GRIS} fond={GRIS_P} bordure="#DDE0E5">
            {filiale.libelle} n'a aucun historique {anneeN1} — entité intégrée au dispositif en cours d'exercice.
            La comparaison N-1 affiche « non disponible » sur l'ensemble de ses indicateurs.
          </Bandeau>
        )}

        {/* Fiche d'identité de la filiale */}
        <section style={{ marginTop: 16, background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap",
                        padding: "17px 20px", borderBottom: "1px solid #EDEFF2" }}>
            <div style={{ background: "#F7F8FA", border: "1px solid #E4E7EC", borderRadius: 9,
                          padding: "11px 16px", display: "flex", alignItems: "center" }}>
              <img src={LOGOS[filiale.logo]} alt={filiale.libelle} style={{ height: 34, maxWidth: 130, objectFit: "contain" }} />
            </div>
            <div style={{ minWidth: 210 }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -.2 }}>{filiale.libelle}</div>
              <div style={{ fontSize: 12, color: "#69707E", marginTop: 4 }}>
                Entité juridique {filiale.ej} · {attendus} indicateur{attendus > 1 ? "s" : ""} affecté{attendus > 1 ? "s" : ""}
                {attendus < 7 && (
                  <span style={{ marginLeft: 7, background: BLEU_P, color: "#1B547F", border: "1px solid #B4D3EC",
                                 borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                    PÉRIMÈTRE RÉDUIT
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#69707E", marginTop: 3 }}>
                Correspondant <strong style={{ color: NAVY }}>{filiale.corr}</strong> · {filiale.mail}
                {filiale.admin && (
                  <span style={{ marginLeft: 6, background: "rgba(232,185,60,.16)", color: "#8A6A12",
                                 border: `1px solid ${OR}`, borderRadius: 4, padding: "1px 5px",
                                 fontSize: 10, fontWeight: 700 }}>ADMIN</span>
                )}
              </div>
            </div>
            <div style={{ flex: 1 }} />
            {annee === EXERCICE && (
              <button onClick={() => setReouvrir((v) => !v)}
                style={{ border: `1px solid ${AMBRE}`, background: reouvrir ? AMBRE : AMBRE_P,
                         color: reouvrir ? "#FFF" : "#8A5A12", borderRadius: 7, padding: "10px 15px",
                         fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Rouvrir une période close
              </button>
            )}
          </div>

          {/* Réouverture de période — motif obligatoire et journalisation (RG-31) */}
          {reouvrir && (
            <div style={{ background: "#FFFBF3", borderBottom: "1px solid #F2D9A8", padding: "15px 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8A5A12", marginBottom: 9 }}>
                Réouverture d'une période close — {filiale.libelle}
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                <Champ label="Période à rouvrir">
                  <select value={reouvMois} onChange={(e) => setReouvMois(Number(e.target.value))} style={selectStyle}>
                    {MOIS_LONG.slice(0, nOuvert - 1).map((m, i) => (
                      <option key={m} value={i + 1}>{m} {annee}</option>
                    ))}
                  </select>
                </Champ>
                <div style={{ flex: 1, minWidth: 300 }}>
                  <label style={{ display: "block", fontSize: 10.5, textTransform: "uppercase", letterSpacing: .4,
                                  color: "#69707E", fontWeight: 700, marginBottom: 5 }}>
                    Motif — obligatoire
                  </label>
                  <textarea value={reouvMotif} onChange={(e) => setReouvMotif(e.target.value)} rows={2}
                    placeholder="Justification de la réouverture, conservée au journal d'audit…"
                    style={{ width: "100%", border: "1px solid #CFD5DE", borderRadius: 6, padding: "8px 11px",
                             fontSize: 12.5, fontFamily: "inherit", color: NAVY, resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <div style={{ paddingTop: 22 }}>
                  <button onClick={confirmerReouverture} disabled={!reouvMotif.trim()}
                    style={{ border: "none", background: reouvMotif.trim() ? NAVY : "#C6CDD8", color: "#FFF",
                             borderRadius: 6, padding: "10px 16px", fontSize: 12.5, fontWeight: 700,
                             cursor: reouvMotif.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                    Confirmer la réouverture
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#8A5A12", marginTop: 9 }}>
                La réouverture porte sur le couple filiale × mois, exige un motif et est journalisée avec son auteur.
                Le correspondant est notifié dans l'application.
              </div>
            </div>
          )}

          {/* Cartouche de synthèse */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(196px, 1fr))",
                        gap: 0, background: "#FAFBFC" }}>
            <Chiffre titre={`Score au ${MOIS_LONG[moisEffectif - 1].toLowerCase()}`}
                     valeur={score == null ? "—" : pct(score)}
                     sous={`moyenne des taux calculables · groupe ${moyenneGroupe == null ? "—" : pct(moyenneGroupe, 0)}`}
                     couleur={score == null ? GRIS : score >= .8 ? VERT_F : score >= .6 ? "#96601A" : TERRE} />
            <Chiffre titre="Rang dans le groupe"
                     valeur={rang < 0 ? "—" : `${rang + 1}${rang === 0 ? "er" : "e"} / ${classement.length}`}
                     sous={rang < 0 ? "score non calculable" : rang < 3 ? "parmi les trois premières" : "sur les filiales évaluables"}
                     couleur={rang >= 0 && rang < 3 ? "#8A6A12" : NAVY} />
            <Chiffre titre="Objectifs atteints" valeur={`${atteints} / ${attendus}`}
                     sous={`au mois de ${MOIS_LONG[moisEffectif - 1].toLowerCase()}`}
                     couleur={atteints === attendus ? VERT_F : NAVY} />
            <Chiffre titre="Complétude du mois" valeur={`${renseignes} / ${attendus}`}
                     sous={renseignes === attendus ? "remontée complète"
                           : brouillonsRef > 0 ? `dont ${brouillonsRef} en brouillon, non compté${brouillonsRef > 1 ? "s" : ""}`
                           : "remontée incomplète"}
                     couleur={renseignes === attendus ? VERT_F : AMBRE} jauge={renseignes / attendus} />
          </div>
        </section>

        {/* Cartes indicateurs */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(470px, 1fr))", gap: 14 }}>
          {data.map((d) => {
            const cle = `${filiale.code}|${d.ind.code}`;
            const cleFil = `${filiale.code}|${d.ind.code}|${annee}`;
            const fil = [...(FILS[cleFil] || []), ...(messages[cleFil] || [])];
            const ouvert = panneau[cle] || null;

            if (d.sansDonnees) return (
              <section key={d.ind.code} style={{ background: "#FFF", border: "1px solid #E1E5EB",
                                                 borderRadius: 10, borderTop: "3px solid #E1E5EB", padding: "16px 18px" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{d.ind.n}. {d.ind.court}</div>
                <div style={{ fontSize: 12, color: GRIS, marginTop: 8 }}>
                  Aucune donnée pour l'exercice {annee}. Cette filiale a été intégrée au dispositif ultérieurement.
                </div>
              </section>
            );

            const toutHist = !!histComplet[cle];
            const lignesVisibles = toutHist ? d.lignes : d.lignes.slice(-3);
            const masquees = d.lignes.length - lignesVisibles.length;

            const est = d.dernier ? (d.dernier.taux > 1 ? "SUR" : d.dernier.taux >= d.obj ? "OK" : "COURS") : "VIDE";
            const accent = est === "OK" ? VERT : est === "SUR" ? BLEU : est === "COURS" ? AMBRE : "#E1E5EB";

            return (
              <section key={d.ind.code} style={{ background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                borderTop: `3px solid ${accent}`, display: "flex", flexDirection: "column" }}>

                {/* En-tête de carte */}
                <div style={{ padding: "14px 18px 8px", display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <div style={{ width: 25, height: 25, borderRadius: 5, background: NAVY, color: "#FFF", flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                    {d.ind.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{d.ind.court}</div>
                    <div style={{ fontSize: 11, color: "#69707E", marginTop: 3 }}>{d.ind.libelle}</div>
                    <div style={{ fontSize: 10.5, color: GRIS, marginTop: 4 }}>
                      Mode <strong style={{ color: "#5B6473" }}>{d.ind.mode}</strong> · {d.ind.num} ÷ {d.ind.den}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1,
                      color: est === "OK" ? VERT_F : est === "SUR" ? BLEU : est === "COURS" ? NAVY : GRIS }}>
                      {d.dernier ? pct(d.dernier.taux) : "—"}
                    </div>
                    <div style={{ fontSize: 10.5, color: GRIS, marginTop: 3 }}>
                      {d.moisDernier ? `au ${MOIS_LONG[d.moisDernier - 1].toLowerCase()}` : "non saisi"}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "0 12px" }}>
                  <Courbe pts={d.s} ptsN1={compareN1 ? d.n1 : null} objectif={d.obj}
                          objectifGroupe={d.objGroupe} annee={annee} />
                </div>

                {/* Bandeau de lecture */}
                <div style={{ padding: "6px 18px 12px", display: "flex", gap: 15, flexWrap: "wrap",
                              fontSize: 11.5, color: "#5B6473", alignItems: "center" }}>
                  <span>
                    Objectif <strong style={{ color: NAVY }}>{pct(d.obj, 0)}</strong>
                    {d.derogatoire && (
                      <span style={{ marginLeft: 5, background: AMBRE_P, color: "#8A5A12", border: "1px solid #F0D6A4",
                                     borderRadius: 4, padding: "1px 5px", fontSize: 9.5, fontWeight: 700 }}>DÉROGATOIRE</span>
                    )}
                  </span>
                  {compareN1 && (
                    <span>
                      {anneeN1} :{" "}
                      {d.ecartN1 == null ? <em style={{ color: GRIS }}>non disponible</em> : (
                        <strong style={{ color: d.ecartN1 >= 0 ? VERT_F : TERRE }}>
                          {d.ecartN1 >= 0 ? "+" : ""}{d.ecartN1.toFixed(1).replace(".", ",")} pts
                        </strong>
                      )}
                    </span>
                  )}
                  {d.premierFranchissement && (
                    <span style={{ color: VERT_F }}>
                      Objectif franchi en {MOIS_LONG[d.premierFranchissement - 1].toLowerCase()}
                      {d.dernier && d.dernier.taux < d.obj && (
                        <em style={{ color: AMBRE }}> — repassé en dessous depuis</em>
                      )}
                    </span>
                  )}
                  {d.s.some((p) => p === null) && (
                    <span style={{ color: AMBRE }}>Mois non saisi — courbe interrompue, aucun report</span>
                  )}
                  {d.s.some((p) => p && p.nc) && (
                    <span style={{ color: GRIS }}>Dénominateur nul — valeur exclue des moyennes</span>
                  )}
                  {d.brouillonsExercice.length > 0 && (
                    <span style={{ color: "#8A5A12", fontWeight: 700 }}>
                      {d.brouillonsExercice.length} saisie{d.brouillonsExercice.length > 1 ? "s" : ""} en brouillon
                      {" ("}{d.brouillonsExercice.map((m) => MOIS_LONG[m - 1].toLowerCase()).join(", ")}{")"}
                    </span>
                  )}
                </div>

                {/* Avertissement explicite : l'objectif de référence est l'objectif groupe.
                    Toute dérogation décidée par le Directeur est signalée sans ambiguïté (RG-23, RG-24). */}
                {(d.derogatoire || d.objDifferentN1) && (
                  <div style={{ margin: "0 14px 12px", background: AMBRE_P, border: "1px solid #F0D6A4",
                                borderLeft: `3px solid ${AMBRE}`, borderRadius: 7, padding: "10px 13px",
                                fontSize: 11.5, color: "#7A4E10", lineHeight: 1.55 }}>
                    {d.derogatoire && (
                      <>
                        <strong>Objectif dérogatoire.</strong> L'objectif de référence de cet indicateur au
                        référentiel groupe est de <strong>{pct(d.objGroupe, 0)}</strong>. Le Directeur CI Groupe
                        a fixé <strong>{pct(d.obj, 0)}</strong> pour l'affectation {filiale.libelle} × {d.ind.court}
                        {" "}au titre du seul exercice {annee}. Le statut, le score de la filiale et la couleur des
                        cellules sont calculés sur cet objectif dérogatoire, non sur l'objectif groupe.
                      </>
                    )}
                    {d.objDifferentN1 && (
                      <div style={{ marginTop: d.derogatoire ? 6 : 0 }}>
                        <strong>Comparaison N-1 à interpréter avec prudence.</strong> L'objectif applicable en
                        {" "}{anneeN1} était de <strong>{pct(d.objN1, 0)}</strong>, contre {pct(d.obj, 0)} en {annee}.
                        L'écart en points compare deux taux, jamais deux niveaux d'exigence identiques.
                      </div>
                    )}
                  </div>
                )}

                {/* Onglets de traçabilité */}
                <div style={{ marginTop: "auto", borderTop: "1px solid #EDEFF2", background: "#FAFBFC",
                              padding: "8px 14px", display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <Onglet actif={ouvert === "HIST"} onClick={() => basculer(cle, "HIST")}
                          label="Historique des saisies" n={d.lignes.filter((l) => l.etat !== "NON_SAISI").length} />
                  <Onglet actif={ouvert === "PJ"} onClick={() => basculer(cle, "PJ")}
                          label="Pièces jointes" n={d.nbPJ} />
                  <Onglet actif={ouvert === "COM"} onClick={() => basculer(cle, "COM")}
                          label="Fil de commentaires" n={fil.length} accent={BLEU} />
                </div>

                {ouvert === "HIST" && (
                  <div style={{ borderTop: "1px solid #EDEFF2", padding: "12px 16px 15px" }}>
                    <div style={{ fontSize: 11, color: GRIS, marginBottom: 8 }}>
                      {toutHist
                        ? `Exercice ${annee} complet — ${d.lignes.length} période${d.lignes.length > 1 ? "s" : ""} ouverte${d.lignes.length > 1 ? "s" : ""}.`
                        : `${lignesVisibles.length} dernier${lignesVisibles.length > 1 ? "s" : ""} mois affiché${lignesVisibles.length > 1 ? "s" : ""} sur ${d.lignes.length}.`}
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                      <thead>
                        <tr style={{ color: "#5B6473" }}>
                          <th style={thMini}>Mois</th>
                          <th style={{ ...thMini, textAlign: "right" }}>Num.</th>
                          <th style={{ ...thMini, textAlign: "right" }}>Dén.</th>
                          <th style={{ ...thMini, textAlign: "right" }}>Taux</th>
                          <th style={thMini}>Saisie</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lignesVisibles.map((l) => {
                          if (l.etat === "NON_SAISI") return (
                            <tr key={l.m}>
                              <td colSpan={5} style={{ ...tdMini, background: "#FBFCFD" }}>
                                <strong style={{ color: NAVY }}>{MOIS_LONG[l.m - 1]}</strong>
                                <span style={{ color: AMBRE, marginLeft: 10, fontWeight: 700 }}>Non saisi</span>
                                <span style={{ color: GRIS, marginLeft: 8 }}>
                                  aucune valeur reportée, la courbe reste interrompue
                                </span>
                              </td>
                            </tr>
                          );
                          const k = l.etat === "NON_CALCULABLE" ? null : couleurs(l.p.taux, d.obj);
                          return (
                            <tr key={l.m}>
                              <td colSpan={5} style={{ padding: 0 }}>
                                <div style={{ borderBottom: "1px solid #F1F3F6", padding: "7px 0" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                    <strong style={{ width: 74, fontSize: 12 }}>{MOIS_LONG[l.m - 1]}</strong>
                                    {l.etat === "NON_CALCULABLE" ? (
                                      <span style={{ color: GRIS, background: GRIS_P, border: "1px solid #E2E4E8",
                                                     borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                                        n/a — dénominateur nul
                                      </span>
                                    ) : (
                                      <>
                                        <span style={{ color: "#5B6473" }}>
                                          {l.p.num} <span style={{ color: "#C3C8D1" }}>÷</span> {l.p.den}
                                        </span>
                                        <span style={{ background: k.bg, color: k.fg, border: `1px solid ${k.bd}`,
                                                       borderRadius: 4, padding: "2px 8px", fontWeight: 700, fontSize: 11.5 }}>
                                          {pct(l.p.taux)}
                                        </span>
                                      </>
                                    )}
                                    <span style={{ flex: 1 }} />
                                    <span style={{ color: GRIS, fontSize: 11 }}>
                                      {l.meta.auteur} · {l.meta.date} à {l.meta.heure}
                                    </span>
                                    {l.brouillon && (
                                      <span style={{ background: AMBRE_P, color: "#8A5A12", border: "1px solid #F0D6A4",
                                                     borderRadius: 4, padding: "1px 6px", fontSize: 9.5, fontWeight: 700 }}
                                            title="Numérateur et dénominateur fournis, commentaire de saisie manquant. Non compté comme renseigné dans le taux de remontée.">
                                        BROUILLON
                                      </span>
                                    )}
                                    {l.meta.modifie && (
                                      <span style={{ background: AMBRE_P, color: "#8A5A12", border: "1px solid #F0D6A4",
                                                     borderRadius: 4, padding: "1px 6px", fontSize: 9.5, fontWeight: 700 }}
                                            title={`Modifiée le ${l.meta.dateModif}. Valeurs avant et après conservées au journal d'audit.`}>
                                        MODIFIÉE
                                      </span>
                                    )}
                                    {l.meta.reouverture && (
                                      <span style={{ background: "#F3E8F7", color: "#6B3A82", border: "1px solid #DCC4E6",
                                                     borderRadius: 4, padding: "1px 6px", fontSize: 9.5, fontWeight: 700 }}
                                            title={l.meta.reouverture.motif}>
                                        PÉRIODE ROUVERTE
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: 11, marginTop: 4, lineHeight: 1.5, paddingLeft: 84,
                                                color: l.brouillon ? "#8A5A12" : "#69707E",
                                                fontStyle: l.brouillon ? "italic" : "normal" }}>
                                    {l.brouillon
                                      ? "Commentaire manquant — saisie en brouillon. La valeur est enregistrée et s'affiche, mais l'indicateur n'est pas compté comme renseigné dans le taux de remontée du mois."
                                      : l.commentaire}
                                  </div>
                                  {l.pj.length > 0 && (
                                    <div style={{ paddingLeft: 84, marginTop: 5, display: "flex", gap: 7, flexWrap: "wrap" }}>
                                      {l.pj.map((p) => <PieceJointe key={p.nom} p={p} compact />)}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {(masquees > 0 || toutHist) && (
                      <button onClick={() => setHistComplet((h) => ({ ...h, [cle]: !h[cle] }))}
                        style={{ marginTop: 10, border: "1px solid #DDE1E8", background: "#FFF", color: BLEU,
                                 borderRadius: 6, padding: "7px 13px", fontSize: 11.5, fontWeight: 700,
                                 cursor: "pointer", fontFamily: "inherit" }}>
                        {toutHist
                          ? "Réduire aux trois derniers mois"
                          : `Voir tout l'exercice — ${masquees} mois antérieur${masquees > 1 ? "s" : ""}`}
                      </button>
                    )}

                    <div style={{ fontSize: 10.5, color: GRIS, marginTop: 9, lineHeight: 1.6 }}>
                      Chaque saisie conserve l'auteur de sa création et, le cas échéant, l'auteur et la date de sa
                      dernière modification. Le détail des valeurs avant et après est consultable au journal d'audit.
                    </div>
                  </div>
                )}

                {ouvert === "PJ" && (
                  <div style={{ borderTop: "1px solid #EDEFF2", padding: "12px 16px 15px" }}>
                    {d.nbPJ === 0 ? (
                      <div style={{ fontSize: 12, color: GRIS, fontStyle: "italic" }}>
                        Aucune pièce jointe déposée sur cet indicateur pour l'exercice {annee}.
                        La pièce jointe est facultative : son absence n'empêche ni la remontée ni le calcul.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 8 }}>
                        {d.lignes.filter((l) => l.pj && l.pj.length).map((l) => (
                          <div key={l.m}>
                            <div style={{ fontSize: 11, color: GRIS, fontWeight: 700, textTransform: "uppercase",
                                          letterSpacing: .3, marginBottom: 5 }}>
                              {MOIS_LONG[l.m - 1]} {annee}
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {l.pj.map((p) => <PieceJointe key={p.nom} p={p} />)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 10.5, color: GRIS, marginTop: 11, lineHeight: 1.6 }}>
                      Formats acceptés : PDF, Excel, Word, PowerPoint, images. 10 Mo maximum par fichier.
                      Les pièces suivent le cloisonnement de leur saisie : seuls les acteurs habilités sur
                      {" "}{filiale.libelle} y accèdent.
                    </div>
                  </div>
                )}

                {ouvert === "COM" && (
                  <div style={{ borderTop: "1px solid #EDEFF2", padding: "12px 16px 15px" }}>
                    {fil.length === 0 && (
                      <div style={{ fontSize: 12, color: GRIS, fontStyle: "italic", marginBottom: 10 }}>
                        Aucun échange sur cet indicateur pour l'exercice {annee}.
                      </div>
                    )}
                    {fil.map((m, i) => (
                      <div key={i} style={{ marginBottom: 9, background: m.r === "DIRECTEUR" ? "#F4F8FC" : "#F8FAF4",
                        border: `1px solid ${m.nouveau ? BLEU : m.r === "DIRECTEUR" ? "#DCE9F4" : "#E6EFD8"}`,
                        borderRadius: 7, padding: "9px 12px" }}>
                        <div style={{ fontSize: 11, color: "#5B6473", marginBottom: 4 }}>
                          <strong style={{ color: m.r === "DIRECTEUR" ? "#1F5C8B" : VERT_F }}>{m.a}</strong>
                          <span style={{ margin: "0 6px", color: "#C3C8D1" }}>·</span>{m.d}
                          {m.nouveau && (
                            <span style={{ marginLeft: 7, background: BLEU, color: "#FFF", borderRadius: 4,
                                           padding: "1px 6px", fontSize: 9.5, fontWeight: 700 }}>PUBLIÉ</span>
                          )}
                        </div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{m.t}</div>
                      </div>
                    ))}

                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <input value={brouillon[cleFil] || ""}
                        onChange={(e) => setBrouillon((b) => ({ ...b, [cleFil]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") publier(cleFil); }}
                        placeholder={`Publier un commentaire à ${filiale.corr}…`}
                        style={{ flex: 1, border: "1px solid #CFD5DE", borderRadius: 6, padding: "8px 11px",
                                 fontSize: 12.5, fontFamily: "inherit", color: NAVY }} />
                      <button onClick={() => publier(cleFil)}
                        style={{ border: "none", background: NAVY, color: "#FFF", borderRadius: 6,
                                 padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                                 fontFamily: "inherit" }}>Publier</button>
                    </div>
                    <div style={{ fontSize: 10.5, color: GRIS, marginTop: 8, lineHeight: 1.6 }}>
                      Le message est immédiatement visible par {filiale.corr}, sans action de sa part, et signalé
                      par une notification dans l'application. Une fois publié, il n'est ni modifiable ni supprimable.
                      Ce fil est cloisonné à {filiale.libelle}.
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Journal des événements de la filiale */}
        <section style={{ marginTop: 18, background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          padding: "15px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
            <div style={{ width: 4, height: 18, background: NAVY, borderRadius: 2 }} />
            <div style={{ fontSize: 14.5, fontWeight: 700 }}>Journal des événements — {filiale.libelle}</div>
            <div style={{ fontSize: 11, color: GRIS }}>exercice {annee} · extrait du journal d'audit</div>
          </div>
          {journal.map((e, i) => {
            const c = e.type === "REOUVERTURE" ? "#6B3A82" : e.type === "OBJECTIF" ? BLEU
                    : e.type === "MODIFICATION" ? AMBRE : VERT_F;
            return (
              <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0",
                                    borderBottom: i < journal.length - 1 ? "1px solid #F1F3F6" : "none" }}>
                <div style={{ width: 6, borderRadius: 3, background: c, flexShrink: 0, alignSelf: "stretch" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{e.t}</div>
                  {e.avant && (
                    <div style={{ fontSize: 11.5, color: "#5B6473", marginTop: 3 }}>
                      Valeur avant <strong>{e.avant}</strong> → valeur après <strong style={{ color: BLEU }}>{e.apres}</strong>
                    </div>
                  )}
                  {e.motif && (
                    <div style={{ fontSize: 11.5, color: "#5B6473", marginTop: 3, fontStyle: "italic" }}>
                      Motif : {e.motif}
                    </div>
                  )}
                  <div style={{ fontSize: 10.5, color: GRIS, marginTop: 4 }}>{e.par} · {e.d}</div>
                </div>
                {e.nouveau && (
                  <span style={{ background: BLEU, color: "#FFF", borderRadius: 4, padding: "1px 6px",
                                 fontSize: 9.5, fontWeight: 700, alignSelf: "flex-start" }}>NOUVEAU</span>
                )}
              </div>
            );
          })}
        </section>

        {/* Légende */}
        <section style={{ marginTop: 16, background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          padding: "14px 20px", display: "flex", gap: 24, flexWrap: "wrap",
                          fontSize: 11.5, color: "#5B6473", alignItems: "center" }}>
          <Legende couleur={BLEU} texte={`Exercice ${annee}`} />
          <Legende couleur="#C3C8D1" texte={`Exercice ${anneeN1}`} tirets />
          <Legende couleur={VERT_F} texte="Objectif appliqué à l'affectation" tirets />
          <Legende couleur="#B9BFC9" texte="Objectif groupe, affiché en cas de dérogation" tirets />
          <span>● <span style={{ color: VERT_F, fontWeight: 700 }}>Point plein</span> = objectif atteint ce mois-là</span>
          <span><strong>n/a</strong> = dénominateur nul, exclu des moyennes, jamais compté comme 0 %</span>
          <span><strong>Interruption</strong> = mois non saisi, aucune interpolation</span>
        </section>

        <footer style={{ marginTop: 22, fontSize: 11, color: GRIS, textAlign: "center", lineHeight: 1.7 }}>
          Prototype Bloc 3 · Écran V5 — Détail par filiale · Règles RG-13, RG-15, RG-17, RG-20 à RG-32, RG-35 à RG-45<br />
          Groupe ERANOVE — Contrôle Interne Groupe · 11 entités juridiques, 12 filiales déclarantes · Données fictives
        </footer>
      </main>
    </div>
  );
}

/* ---------- Sous-composants ---------- */
const selectStyle = { border: "1px solid #CFD5DE", borderRadius: 6, padding: "8px 10px",
                      fontSize: 13, minWidth: 165, background: "#FFF", color: NAVY, fontFamily: "inherit" };
const thMini = { textAlign: "left", fontSize: 10, textTransform: "uppercase", letterSpacing: .3,
                 fontWeight: 700, padding: "0 0 5px", borderBottom: "1px solid #E1E5EB" };
const tdMini = { padding: "7px 0", borderBottom: "1px solid #F1F3F6", fontSize: 11.5 };

function Champ({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 10.5, textTransform: "uppercase", letterSpacing: .4,
                      color: "#69707E", fontWeight: 700, marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

function Bouton({ children }) {
  return (
    <button style={{ border: "1px solid #CFD5DE", background: "#FFF", color: "#4A5261", borderRadius: 6,
                     padding: "9px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{children}</button>
  );
}

function Chiffre({ titre, valeur, sous, couleur, jauge }) {
  return (
    <div style={{ padding: "14px 20px", borderRight: "1px solid #EDEFF2" }}>
      <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: .4, color: "#69707E",
                    fontWeight: 700, marginBottom: 6 }}>{titre}</div>
      <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1, color: couleur || NAVY }}>{valeur}</div>
      {jauge != null && (
        <div style={{ height: 4, background: "#E7EAEF", borderRadius: 2, margin: "8px 0 4px", overflow: "hidden" }}>
          <div style={{ width: `${Math.min(100, jauge * 100)}%`, height: "100%",
                        background: jauge >= 1 ? VERT : AMBRE }} />
        </div>
      )}
      {sous && <div style={{ fontSize: 10.5, color: GRIS, marginTop: jauge != null ? 0 : 6 }}>{sous}</div>}
    </div>
  );
}

function Onglet({ label, n, actif, onClick, accent }) {
  const c = accent || NAVY;
  return (
    <button onClick={onClick}
      style={{ border: `1px solid ${actif ? c : "#DDE1E8"}`, background: actif ? c : "#FFF",
               color: actif ? "#FFF" : "#4A5261", borderRadius: 6, padding: "6px 11px",
               fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", fontWeight: actif ? 700 : 400,
               display: "inline-flex", alignItems: "center", gap: 7 }}>
      {actif ? "▾" : "▸"} {label}
      <span style={{ background: actif ? "rgba(255,255,255,.25)" : "#EEF1F5",
                     color: actif ? "#FFF" : "#5B6473", borderRadius: 9, padding: "1px 7px",
                     fontSize: 10, fontWeight: 700 }}>{n}</span>
    </button>
  );
}

function PieceJointe({ p, compact }) {
  const c = COULEUR_EXT[p.ext] || GRIS;
  return (
    <div title={`Déposée par ${p.par} le ${p.date}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF",
               border: "1px solid #E1E5EB", borderRadius: 7, padding: compact ? "4px 9px" : "8px 12px" }}>
      <span style={{ background: c, color: "#FFF", borderRadius: 4, padding: "2px 5px",
                     fontSize: 9, fontWeight: 700, letterSpacing: .3 }}>{p.ext.toUpperCase()}</span>
      <span style={{ fontSize: compact ? 10.5 : 12, color: NAVY }}>{p.nom}</span>
      <span style={{ fontSize: compact ? 9.5 : 11, color: GRIS }}>{p.taille}</span>
      {!compact && <span style={{ fontSize: 11, color: GRIS }}>· {p.par}, {p.date}</span>}
    </div>
  );
}

function Bandeau({ children, couleur, fond, bordure }) {
  return (
    <div style={{ marginTop: 12, background: fond, border: `1px solid ${bordure}`, borderLeft: `3px solid ${couleur}`,
                  borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#5B6473", lineHeight: 1.55 }}>
      {children}
    </div>
  );
}

function Legende({ couleur, texte, tirets }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <svg width="26" height="8"><line x1="0" y1="4" x2="26" y2="4" stroke={couleur} strokeWidth="2.4"
        strokeDasharray={tirets ? "4 3" : "0"} /></svg>
      {texte}
    </span>
  );
}
