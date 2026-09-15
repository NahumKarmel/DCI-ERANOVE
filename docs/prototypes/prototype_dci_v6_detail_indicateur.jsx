import React, { useState, useMemo } from "react";

/* ============================================================
   Tableau de bord Contrôle Interne Groupe ERANOVE
   Bloc 3 — Prototype V6 : Détail par indicateur (vue Directeur CI Groupe)
   Un indicateur, les filiales qui le portent, courbes superposées avec mise
   en avant, moyenne groupe, tableau comparatif sans classement.
   Règles RG-12, RG-13, RG-15, RG-18, RG-22 à RG-28, RG-32.
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
const NUAGE = "#D3D8E0";      // courbes du nuage, non mises en avant

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

const FILIALES = [
  { code:"GS2E_SDCI", libelle:"GS2E — SDCI", ej:"GS2E", logo:"GS2E", corr:"K. Assamoi", affectes:TOUS,
    profil:{ perf:.72, debut:1, trous:[], n1:.63 } },
  { code:"GS2E_SDRM", libelle:"GS2E — SDRM", ej:"GS2E", logo:"GS2E", corr:"H. M.", admin:true,
    affectes:["PCI","CARTO","AMR","RECO_SEM"],
    profil:{ perf:.70, debut:1, trous:[], n1:.60 } },
  { code:"CIE", libelle:"CIE", ej:"CIE", logo:"CIE", corr:"A. Koffi", affectes:TOUS,
    profil:{ perf:.93, debut:1, trous:[], n1:.86, sur:["RECO_SEM"] } },
  { code:"SODECI", libelle:"SODECI", ej:"SODECI", logo:"SODECI", corr:"M. Diomandé", affectes:TOUS,
    profil:{ perf:.84, debut:1, trous:[], n1:.79, creux:[4,5,6] } },
  { code:"KEKELI", libelle:"KEKELI", ej:"KEKELI", logo:"KEKELI", corr:"B. Ouattara", affectes:TOUS,
    profil:{ perf:.66, debut:1, trous:[], n1:.58, denZero:{ TCI:[1,2] } } },
  { code:"CIPREL", libelle:"CIPREL", ej:"CIPREL", logo:"CIPREL", corr:"S. N'Guessan", affectes:TOUS,
    profil:{ perf:.74, debut:1, trous:[], n1:.71 } },
  { code:"ATINKOU", libelle:"ATINKOU", ej:"ATINKOU", logo:"ATINKOU", corr:"R. Bamba", affectes:TOUS,
    profil:{ perf:.61, debut:3, trous:[], n1:.52 } },
  { code:"ASOKH", libelle:"ASOKH", ej:"ASOKH", logo:"ASOKH", corr:"L. Traoré", affectes:TOUS,
    profil:{ perf:.69, debut:1, trous:[5], n1:.64 } },
  { code:"SDER", libelle:"SDER", ej:"SDER", logo:"SDER", corr:"P. Yao", affectes:TOUS,
    profil:{ perf:.47, debut:1, trous:[], n1:.44, reperdu:"AMR" } },
  { code:"OMILAYE", libelle:"OMILAYE", ej:"OMILAYE", logo:"OMILAYE", corr:"F. Kouassi", affectes:TOUS,
    profil:{ perf:.44, debut:1, trous:[8], n1:.41, objSpec:{ PCI:0.8 } } },
  { code:"AWALE", libelle:"AWALE", ej:"AWALE", logo:"AWALE", corr:"D. Coulibaly", affectes:TOUS,
    profil:{ perf:.58, debut:4, trous:[], n1:null } },
  { code:"SMART_ENERGY", libelle:"SMART ENERGY", ej:"SMART ENERGY", logo:"SMART_ENERGY", corr:"N. Aké", affectes:TOUS,
    profil:{ perf:.88, debut:1, trous:[], n1:.81 } },
];

const MOIS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const MOIS_LONG = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const EXERCICE = 2026;
const DERNIER_MOIS = 8;
const EXERCICES = [2026, 2025];
const derniersMoisDe = (a) => (a === EXERCICE ? DERNIER_MOIS : 12);

/* ---------- Générateur déterministe, identique à V3, V4 et V5 (RG-46) ---------- */
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }

function serie(filiale, ind, annee) {
  const p = filiale.profil;
  const nMois = annee === EXERCICE ? DERNIER_MOIS : 12;
  const base = annee === EXERCICE ? p.perf : p.n1;
  if (base === null || base === undefined) return null;

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

/* L'objectif de référence est celui du référentiel groupe. Une dérogation est portée
   par l'affectation : filiale × indicateur × exercice (RG-23, RG-24). */
const objectifDe = (fil, ind, annee) =>
  (annee === EXERCICE ? fil.profil.objSpec?.[ind.code] : undefined) ?? ind.objectif;

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
   Graphe des courbes superposées — nuage gris, mises en avant colorées
   ============================================================ */
function Nuage({ lots, objectif, moyenne, annee, focus, extremes, afficherMoyenne, onFocus }) {
  const W = 1060, H = 330, ML = 46, MR = 128, MT = 16, MB = 26;
  const iw = W - ML - MR, ih = H - MT - MB;
  const nOuvert = derniersMoisDe(annee);

  const toutes = lots.flatMap((l) => (l.s || []).filter((p) => p && p.taux != null).map((p) => p.taux));
  const hi = Math.max(1.05, objectif + 0.12, ...(toutes.length ? toutes : [1])) * 1.04;
  const x = (m) => ML + (iw * (m - 1)) / 11;
  const y = (t) => MT + ih - (ih * t) / hi;

  /* Découpage en segments : la courbe s'interrompt sur un trou ou un point
     non calculable, aucune interpolation n'est tracée (RG-32) */
  const segmentsDe = (s) => {
    const seg = []; let cur = [];
    (s || []).forEach((p, i) => {
      if (p && p.taux != null) cur.push([x(i + 1), y(p.taux)]);
      else { if (cur.length > 1) seg.push(cur); cur = []; }
    });
    if (cur.length > 1) seg.push(cur);
    return seg;
  };

  const couleurDe = (code) => {
    if (code === focus) return BLEU;
    if (code === extremes.haut) return VERT_F;
    if (code === extremes.bas) return TERRE;
    return null;
  };

  const enAvant = lots.filter((l) => couleurDe(l.f.code));
  const enFond = lots.filter((l) => !couleurDe(l.f.code));

  const dernierPoint = (s) => {
    for (let i = (s || []).length - 1; i >= 0; i--) if (s[i] && s[i].taux != null) return { m: i + 1, t: s[i].taux };
    return null;
  };

  const ligneMoyenne = afficherMoyenne
    ? moyenne.map((v, i) => (v != null ? `${x(i + 1)},${y(v)}` : null)).filter(Boolean).join(" ")
    : "";

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
            <text x={ML - 7} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill={GRIS}>{Math.round(t * 100)}%</text>
          </g>
        );
      })}

      <line x1={ML} x2={W - MR} y1={y(objectif)} y2={y(objectif)}
            stroke={VERT_F} strokeWidth="1.8" strokeDasharray="6 4" />
      <text x={ML + 5} y={y(objectif) - 6} fontSize="10.5" fill={VERT_F} fontWeight="700">
        objectif groupe {Math.round(objectif * 100)} %
      </text>

      {MOIS.map((m, i) => (
        <text key={m} x={x(i + 1)} y={H - 7} textAnchor="middle" fontSize="10"
              fill={i + 1 <= nOuvert ? GRIS : "#C9CDD5"}>{m}</text>
      ))}

      {/* Nuage en arrière-plan — chaque courbe reste cliquable */}
      {enFond.map((l) => (
        <g key={l.f.code} style={{ cursor: "pointer" }} onClick={() => onFocus(l.f.code)}>
          {segmentsDe(l.s).map((s, i) => (
            <polyline key={i} points={s.map((p) => p.join(",")).join(" ")} fill="none"
                      stroke={NUAGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {segmentsDe(l.s).map((s, i) => (
            <polyline key={"h" + i} points={s.map((p) => p.join(",")).join(" ")} fill="none"
                      stroke="transparent" strokeWidth="10" />
          ))}
        </g>
      ))}

      {/* Moyenne groupe — filiales non saisies exclues, jamais comptées comme 0 (RG-18) */}
      {ligneMoyenne && (
        <polyline points={ligneMoyenne} fill="none" stroke={NAVY} strokeWidth="2.6"
                  strokeDasharray="7 4" strokeLinecap="round" />
      )}

      {/* Courbes mises en avant */}
      {enAvant.map((l) => {
        const c = couleurDe(l.f.code);
        const dp = dernierPoint(l.s);
        return (
          <g key={l.f.code} style={{ cursor: "pointer" }} onClick={() => onFocus(l.f.code)}>
            {segmentsDe(l.s).map((s, i) => (
              <polyline key={i} points={s.map((p) => p.join(",")).join(" ")} fill="none"
                        stroke={c} strokeWidth={l.f.code === focus ? 3.4 : 2.6}
                        strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {(l.s || []).map((p, i) =>
              p && p.taux != null
                ? <circle key={i} cx={x(i + 1)} cy={y(p.taux)} r="3" fill="#FFF" stroke={c} strokeWidth="2" />
                : null)}
            {dp && (
              <text x={x(dp.m) + 8} y={y(dp.t) + 3.5} fontSize="10.5" fill={c} fontWeight="700">
                {l.f.libelle}
              </text>
            )}
          </g>
        );
      })}

      {/* Repères de moyenne en fin de tracé */}
      {ligneMoyenne && (() => {
        let last = null;
        moyenne.forEach((v, i) => { if (v != null) last = { m: i + 1, v }; });
        return last ? (
          <text x={x(last.m) + 8} y={y(last.v) + 3.5} fontSize="10.5" fill={NAVY} fontWeight="700">
            Moyenne groupe
          </text>
        ) : null;
      })()}
    </svg>
  );
}

/* ============================================================ */
export default function DetailParIndicateurDCI() {
  const [annee, setAnnee] = useState(EXERCICE);
  const [indCode, setIndCode] = useState("AMR");
  const [moisBrut, setMois] = useState(DERNIER_MOIS);
  const [compareN1, setCompareN1] = useState(false);
  const [afficherMoyenne, setAfficherMoyenne] = useState(true);
  const [focus, setFocus] = useState(null);
  const [survol, setSurvol] = useState(null);
  const [tri, setTri] = useState({ col: "taux", desc: true });

  const ind = INDICATEURS.find((i) => i.code === indCode);
  const nOuvert = derniersMoisDe(annee);
  const mois = Math.min(moisBrut, nOuvert);
  const anneeN1 = annee - 1;
  const n1Disponible = EXERCICES.includes(anneeN1);

  /* --- Filiales portant l'indicateur : l'affectation est le pivot du modèle --- */
  const porteuses = useMemo(() => FILIALES.filter((f) => f.affectes.includes(ind.code)), [ind]);
  const nonPorteuses = FILIALES.filter((f) => !f.affectes.includes(ind.code));

  const lots = useMemo(() => porteuses.map((f) => {
    const s = serie(f, ind, annee);
    const n1 = n1Disponible ? serie(f, ind, anneeN1) : null;
    const obj = objectifDe(f, ind, annee);
    const objN1 = n1Disponible ? objectifDe(f, ind, anneeN1) : null;
    const p = s ? s[mois - 1] : null;
    const pn1 = n1 ? n1[mois - 1] : null;
    const moisDernier = s ? (s.map((q, i) => (q && q.taux != null ? i + 1 : null)).filter(Boolean).pop() || null) : null;
    return {
      f, s, n1, obj, objGroupe: ind.objectif, objN1,
      derogatoire: obj !== ind.objectif,
      objDifferentN1: pn1 && pn1.taux != null && objN1 != null && objN1 !== obj,
      p, moisDernier,
      etat: !s ? "SANS_HISTORIQUE" : p == null ? "NON_SAISI" : p.nc ? "NON_CALCULABLE" : "OK",
      taux: p && p.taux != null ? p.taux : null,
      atteinte: p && p.taux != null && obj > 0 ? p.taux / obj : null,
      ecart: p && p.taux != null && pn1 && pn1.taux != null ? (p.taux - pn1.taux) * 100 : null,
    };
  }), [porteuses, ind, annee, anneeN1, mois, n1Disponible]);

  /* --- Moyenne groupe mois par mois, filiales non saisies exclues (RG-18) --- */
  const moyenne = useMemo(() => {
    const out = [];
    for (let m = 1; m <= nOuvert; m++) {
      const v = lots.map((l) => (l.s && l.s[m - 1] && l.s[m - 1].taux != null ? l.s[m - 1].taux : null))
                    .filter((t) => t != null);
      out.push(v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);
    }
    return out;
  }, [lots, nOuvert]);

  const calculables = lots.filter((l) => l.taux != null);
  const moyenneMois = calculables.length
    ? calculables.reduce((a, l) => a + l.taux, 0) / calculables.length : null;
  const atteignent = calculables.filter((l) => l.taux >= l.obj).length;
  const mini = calculables.length ? Math.min(...calculables.map((l) => l.taux)) : null;
  const maxi = calculables.length ? Math.max(...calculables.map((l) => l.taux)) : null;
  const renseignees = lots.filter((l) => l.etat === "OK" || l.etat === "NON_CALCULABLE").length;

  const extremes = useMemo(() => {
    if (!calculables.length) return { haut: null, bas: null };
    const tri2 = [...calculables].sort((a, b) => b.taux - a.taux);
    return { haut: tri2[0].f.code, bas: tri2[tri2.length - 1].f.code };
  }, [calculables]);

  const derogations = lots.filter((l) => l.derogatoire);

  const triees = useMemo(() => {
    const l = [...lots];
    const val = (r) => tri.col === "nom" ? r.f.libelle
      : tri.col === "atteinte" ? (r.atteinte ?? -1)
      : tri.col === "ecart" ? (r.ecart ?? -999)
      : (r.taux ?? -1);
    l.sort((a, b) => {
      const va = val(a), vb = val(b);
      const c = typeof va === "string" ? va.localeCompare(vb) : va - vb;
      return tri.desc ? -c : c;
    });
    return l;
  }, [lots, tri]);
  const trierPar = (col) => setTri((t) => t.col === col ? { col, desc: !t.desc } : { col, desc: true });

  const focusActif = focus || survol;

  return (
    <div style={{ background: "#EFF1F5", minHeight: "100vh", fontFamily: "Arial, Helvetica, sans-serif", color: NAVY }}>

      <div style={{ background: "#FDF3E2", borderBottom: "1px solid #F2D9A8", color: "#8A5A12",
                    fontSize: 12, padding: "7px 24px" }}>
        <strong>Environnement de démonstration</strong> — toutes les données affichées sont fictives.
        Aucune donnée réelle du groupe ERANOVE n'est hébergée.
      </div>

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
              Détail par indicateur · comparaison des filiales déclarantes · Exercice {annee}
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

      <nav style={{ background: "#FFF", borderBottom: "1px solid #E1E5EB", padding: "0 24px",
                    display: "flex", gap: 2, overflowX: "auto" }}>
        {["Dashboard consolidé","Détail par filiale","Détail par indicateur","Suivi des remontées","Paramétrage","Journal d'audit"]
          .map((t, i) => (
          <div key={t} style={{ padding: "12px 15px", fontSize: 13, whiteSpace: "nowrap",
            fontWeight: i === 2 ? 700 : 400, color: i === 2 ? NAVY : "#8A909B",
            borderBottom: i === 2 ? `2.5px solid ${VERT}` : "2.5px solid transparent" }}>{t}</div>
        ))}
      </nav>

      {/* Sélecteur d'indicateur */}
      <div style={{ background: "#E7EBF1", borderBottom: "1px solid #D6DCE5", padding: "9px 24px",
                    display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
        <span style={{ color: "#5B6473", fontWeight: 700, letterSpacing: .3,
                       textTransform: "uppercase", fontSize: 10.5, marginRight: 4 }}>
          Indicateur
        </span>
        {INDICATEURS.map((i) => (
          <button key={i.code} onClick={() => { setIndCode(i.code); setFocus(null); }}
            style={{ border: `1px solid ${i.code === indCode ? NAVY : "#C6CDD8"}`,
                     background: i.code === indCode ? NAVY : "#FFFFFF",
                     color: i.code === indCode ? "#FFF" : "#4A5261", borderRadius: 5,
                     padding: "4px 10px", fontSize: 11, cursor: "pointer",
                     fontWeight: i.code === indCode ? 700 : 400 }}>
            {i.n}. {i.court}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px 60px" }}>

        {/* Barre de filtres */}
        <section style={{ background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          padding: "13px 18px", display: "flex", gap: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
          <Champ label="Exercice">
            <select value={annee}
                    onChange={(e) => { const a = Number(e.target.value); setAnnee(a); setMois(derniersMoisDe(a)); setFocus(null); }}
                    style={{ ...selectStyle, minWidth: 130, fontWeight: 700 }}>
              {EXERCICES.map((a) => (
                <option key={a} value={a}>{a}{a === EXERCICE ? " — en cours" : " — clos"}</option>
              ))}
            </select>
          </Champ>
          <Champ label="Mois de référence">
            <select value={mois} onChange={(e) => setMois(Number(e.target.value))} style={selectStyle}>
              {MOIS_LONG.map((m, i) => (
                <option key={m} value={i + 1} disabled={i + 1 > nOuvert}>
                  {m} {annee}{i + 1 > nOuvert ? " — non ouvert" : ""}
                </option>
              ))}
            </select>
          </Champ>
          <label title={n1Disponible ? "" : `Aucun exercice ${anneeN1} dans le dispositif`}
                 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5,
                          cursor: n1Disponible ? "pointer" : "not-allowed", opacity: n1Disponible ? 1 : .55,
                          background: "#F6F8FA", border: "1px solid #E1E5EB", borderRadius: 7, padding: "9px 13px" }}>
            <input type="checkbox" disabled={!n1Disponible} checked={compareN1 && n1Disponible}
                   onChange={(e) => setCompareN1(e.target.checked)} />
            Écart vs {anneeN1}
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer",
                          background: "#F6F8FA", border: "1px solid #E1E5EB", borderRadius: 7, padding: "9px 13px" }}>
            <input type="checkbox" checked={afficherMoyenne} onChange={(e) => setAfficherMoyenne(e.target.checked)} />
            Moyenne groupe
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

        {/* Fiche de l'indicateur */}
        <section style={{ marginTop: 16, background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap",
                        padding: "17px 20px", borderBottom: "1px solid #EDEFF2" }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: NAVY, color: "#FFF", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, fontWeight: 700 }}>{ind.n}</div>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -.2 }}>{ind.court}</div>
              <div style={{ fontSize: 12.5, color: "#5B6473", marginTop: 4, lineHeight: 1.5 }}>{ind.libelle}</div>
              <div style={{ fontSize: 11.5, color: GRIS, marginTop: 6 }}>
                Mode de calcul <strong style={{ color: "#5B6473" }}>{ind.mode}</strong> — la valeur de l'exercice est
                le taux du dernier mois saisi, jamais une moyenne des douze mois.
              </div>
              <div style={{ fontSize: 11.5, color: GRIS, marginTop: 3 }}>
                <strong style={{ color: "#5B6473" }}>{ind.num}</strong> ÷ <strong style={{ color: "#5B6473" }}>{ind.den}</strong>
                {" · "}objectif groupe <strong style={{ color: VERT_F }}>{pct(ind.objectif, 0)}</strong>
              </div>
            </div>
            <div style={{ background: "#F7F8FA", border: "1px solid #E4E7EC", borderRadius: 8,
                          padding: "10px 14px", fontSize: 11.5, color: "#5B6473", maxWidth: 300, lineHeight: 1.55 }}>
              <strong style={{ color: NAVY }}>{porteuses.length} filiales</strong> portent cet indicateur.
              {nonPorteuses.length > 0 && (
                <> Non affecté à {nonPorteuses.map((f) => f.libelle).join(", ")} : exclu de tous les calculs,
                   jamais compté comme une remontée manquante.</>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        background: "#FAFBFC" }}>
            <Chiffre titre={`Moyenne au ${MOIS_LONG[mois - 1].toLowerCase()}`}
                     valeur={moyenneMois == null ? "—" : pct(moyenneMois)}
                     sous={`sur ${calculables.length} filiale${calculables.length > 1 ? "s" : ""} calculable${calculables.length > 1 ? "s" : ""}`}
                     couleur={moyenneMois == null ? GRIS
                            : moyenneMois >= ind.objectif ? VERT_F
                            : moyenneMois >= ind.objectif * .85 ? "#96601A" : TERRE} />
            <Chiffre titre="Objectif atteint" valeur={`${atteignent} / ${calculables.length}`}
                     sous="filiales au-dessus de leur objectif appliqué"
                     couleur={atteignent === calculables.length && calculables.length ? VERT_F : NAVY} />
            <Chiffre titre="Dispersion"
                     valeur={mini == null ? "—" : `${pct(mini, 0)} → ${pct(maxi, 0)}`}
                     sous={mini == null ? "aucune valeur calculable"
                                        : `amplitude de ${((maxi - mini) * 100).toFixed(0)} points entre les extrêmes`} />
            <Chiffre titre="Remontée sur l'indicateur" valeur={`${renseignees} / ${porteuses.length}`}
                     sous={renseignees === porteuses.length ? "toutes les filiales ont saisi" : "filiales n'ayant pas saisi exclues des moyennes"}
                     couleur={renseignees === porteuses.length ? VERT_F : AMBRE}
                     jauge={renseignees / porteuses.length} />
          </div>
        </section>

        {/* Graphe des courbes superposées */}
        <section style={{ marginTop: 16, background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          overflow: "hidden" }}>
          <div style={{ padding: "14px 18px 10px", borderBottom: "1px solid #EDEFF2",
                        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 4, height: 20, background: VERT, borderRadius: 2 }} />
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              Évolution comparée — {porteuses.length} filiales, exercice {annee}
            </div>
            <div style={{ fontSize: 11.5, color: GRIS }}>
              cliquer une courbe ou une ligne du tableau pour la mettre en avant
            </div>
            <div style={{ flex: 1 }} />
            {focus && (
              <button onClick={() => setFocus(null)}
                style={{ border: `1px solid ${BLEU}`, background: BLEU_P, color: "#1B547F", borderRadius: 6,
                         padding: "6px 12px", fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                         fontFamily: "inherit" }}>
                Retirer la mise en avant de {FILIALES.find((f) => f.code === focus)?.libelle}
              </button>
            )}
          </div>

          <div style={{ padding: "8px 14px 4px" }}>
            <Nuage lots={lots} objectif={ind.objectif} moyenne={moyenne} annee={annee}
                   focus={focusActif} extremes={extremes} afficherMoyenne={afficherMoyenne}
                   onFocus={(c) => setFocus((f) => (f === c ? null : c))} />
          </div>

          <div style={{ borderTop: "1px solid #EDEFF2", padding: "11px 18px", display: "flex", gap: 22,
                        flexWrap: "wrap", fontSize: 11.5, color: "#5B6473", alignItems: "center" }}>
            <Legende couleur={VERT_F} texte="Taux le plus élevé au mois de référence" />
            <Legende couleur={TERRE} texte="Taux le plus bas" />
            <Legende couleur={BLEU} texte="Filiale mise en avant" />
            <Legende couleur={NUAGE} texte="Les autres filiales" />
            <Legende couleur={NAVY} texte="Moyenne groupe" tirets />
            <Legende couleur={VERT_F} texte="Objectif groupe" tirets />
            <span><strong>Interruption</strong> = mois non saisi, aucune interpolation</span>
          </div>
        </section>

        {/* Avertissement sur les objectifs dérogatoires */}
        {derogations.length > 0 && (
          <div style={{ marginTop: 14, background: AMBRE_P, border: "1px solid #F0D6A4",
                        borderLeft: `3px solid ${AMBRE}`, borderRadius: 8, padding: "11px 15px",
                        fontSize: 12, color: "#7A4E10", lineHeight: 1.6 }}>
            <strong>Objectifs dérogatoires sur cet indicateur.</strong> La ligne d'objectif tracée sur le graphe
            est celle du référentiel groupe, à {pct(ind.objectif, 0)}. Elle ne s'applique pas à{" "}
            {derogations.map((d, i) => (
              <span key={d.f.code}>
                {i > 0 ? ", " : ""}<strong>{d.f.libelle}</strong>, évaluée à {pct(d.obj, 0)} pour l'exercice {annee}
              </span>
            ))}
            . La colonne « atteinte » du tableau rapporte chaque taux à l'objectif réellement applicable à la filiale,
            ce que la lecture du graphe seul ne permet pas.
          </div>
        )}

        {/* Tableau comparatif — sans classement, colonnes triables */}
        <section style={{ marginTop: 16, background: "#FFF", border: "1px solid #E1E5EB", borderRadius: 10,
                          overflow: "hidden" }}>
          <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #EDEFF2",
                        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 4, height: 20, background: NAVY, borderRadius: 2 }} />
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              Situation au {MOIS_LONG[mois - 1].toLowerCase()} {annee}
            </div>
            <div style={{ fontSize: 11.5, color: GRIS }}>cliquer sur un en-tête pour trier</div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%", minWidth: 900 }}>
              <thead>
                <tr>
                  <Th onClick={() => trierPar("nom")} actif={tri.col === "nom"} desc={tri.desc}
                      style={{ textAlign: "left", minWidth: 210 }}>Filiale</Th>
                  <Th style={{ cursor: "default" }}>{ind.num}</Th>
                  <Th style={{ cursor: "default" }}>{ind.den}</Th>
                  <Th onClick={() => trierPar("taux")} actif={tri.col === "taux"} desc={tri.desc}>Taux</Th>
                  <Th style={{ cursor: "default" }}>Objectif appliqué</Th>
                  <Th onClick={() => trierPar("atteinte")} actif={tri.col === "atteinte"} desc={tri.desc}
                      title="Taux rapporté à l'objectif réellement applicable à la filiale">Atteinte</Th>
                  {compareN1 && n1Disponible && (
                    <Th onClick={() => trierPar("ecart")} actif={tri.col === "ecart"} desc={tri.desc}>
                      Écart {anneeN1}
                    </Th>
                  )}
                  <Th style={{ cursor: "default" }}>Dernier mois saisi</Th>
                </tr>
              </thead>
              <tbody>
                {triees.map((l) => {
                  const enAvant = l.f.code === focusActif;
                  const fond = enAvant ? "#EEF3F9" : "#FFF";
                  const k = l.taux == null ? null : couleurs(l.taux, l.obj);
                  return (
                    <tr key={l.f.code}
                        onMouseEnter={() => setSurvol(l.f.code)} onMouseLeave={() => setSurvol(null)}
                        onClick={() => setFocus((f) => (f === l.f.code ? null : l.f.code))}
                        style={{ background: fond, cursor: "pointer" }}>
                      <td style={{ ...tdStyle, borderLeft: `3px solid ${
                            l.f.code === extremes.haut ? VERT_F
                          : l.f.code === extremes.bas ? TERRE
                          : enAvant ? BLEU : "transparent"}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img src={LOGOS[l.f.logo]} alt="" style={{ height: 20, maxWidth: 62, objectFit: "contain" }} />
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{l.f.libelle}</div>
                            <div style={{ fontSize: 10.5, color: GRIS }}>{l.f.corr}</div>
                          </div>
                        </div>
                      </td>

                      {l.etat === "OK" ? (
                        <>
                          <td style={{ ...tdStyle, textAlign: "center", color: "#5B6473" }}>{l.p.num}</td>
                          <td style={{ ...tdStyle, textAlign: "center", color: "#5B6473" }}>{l.p.den}</td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            <span style={{ background: k.bg, color: k.fg, border: `1px solid ${k.bd}`,
                                           borderRadius: 5, padding: "4px 9px", fontWeight: 700, fontSize: 12.5,
                                           display: "inline-block", minWidth: 56 }}>
                              {pct(l.taux, 0)}
                            </span>
                          </td>
                        </>
                      ) : (
                        <td colSpan={3} style={{ ...tdStyle, textAlign: "center" }}>
                          {l.etat === "NON_CALCULABLE" && (
                            <span title="Dénominateur nul — exclu des moyennes, jamais compté comme 0 %"
                                  style={{ color: GRIS, background: GRIS_P, border: "1px solid #E2E4E8",
                                           borderRadius: 4, padding: "3px 9px", fontSize: 11.5, fontWeight: 700 }}>
                              n/a — dénominateur nul
                            </span>
                          )}
                          {l.etat === "NON_SAISI" && (
                            <span style={{ color: AMBRE, fontSize: 11.5, fontWeight: 700 }}>
                              Non saisi — exclue de la moyenne
                            </span>
                          )}
                          {l.etat === "SANS_HISTORIQUE" && (
                            <span style={{ color: GRIS, fontSize: 11.5 }}>
                              n.d. — aucun historique {annee}
                            </span>
                          )}
                        </td>
                      )}

                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: l.derogatoire ? 700 : 400,
                                       color: l.derogatoire ? "#8A5A12" : "#5B6473" }}>
                          {pct(l.obj, 0)}
                        </span>
                        {l.derogatoire && (
                          <div title={`Objectif groupe ${pct(l.objGroupe, 0)}, dérogation fixée par le Directeur pour l'exercice ${annee}`}
                               style={{ marginTop: 3, display: "inline-block", background: AMBRE_P, color: "#8A5A12",
                                        border: "1px solid #F0D6A4", borderRadius: 4, padding: "1px 6px",
                                        fontSize: 9.5, fontWeight: 700 }}>
                            DÉROGATOIRE
                          </div>
                        )}
                      </td>

                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {l.atteinte == null ? <span style={{ color: GRIS }}>—</span> : (
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 700,
                              color: l.atteinte >= 1 ? VERT_F : l.atteinte >= .85 ? "#7A7A16"
                                   : l.atteinte >= .6 ? "#96601A" : TERRE }}>
                              {pct(l.atteinte, 0)}
                            </div>
                            <div style={{ height: 4, background: "#EDEFF2", borderRadius: 2, marginTop: 4,
                                          overflow: "hidden", width: 68, marginLeft: "auto", marginRight: "auto" }}>
                              <div style={{ width: `${Math.min(100, l.atteinte * 100)}%`, height: "100%",
                                background: l.atteinte >= 1 ? VERT : l.atteinte >= .6 ? AMBRE : TERRE }} />
                            </div>
                          </div>
                        )}
                      </td>

                      {compareN1 && n1Disponible && (
                        <td style={{ ...tdStyle, textAlign: "center" }}
                            title={l.objDifferentN1
                              ? `Attention : l'objectif applicable en ${anneeN1} était de ${pct(l.objN1)}, contre ${pct(l.obj)} en ${annee}.`
                              : ""}>
                          {l.ecart == null ? <span style={{ color: GRIS, fontSize: 11.5 }}>n.d.</span> : (
                            <span style={{ fontSize: 12, fontWeight: 700, color: l.ecart >= 0 ? VERT_F : TERRE }}>
                              {l.ecart >= 0 ? "+" : ""}{l.ecart.toFixed(0)} pts
                              {l.objDifferentN1 && <span style={{ color: AMBRE, marginLeft: 4 }}>◆</span>}
                            </span>
                          )}
                        </td>
                      )}

                      <td style={{ ...tdStyle, textAlign: "center", fontSize: 11.5, color: "#5B6473" }}>
                        {l.moisDernier ? MOIS_LONG[l.moisDernier - 1] : <span style={{ color: GRIS }}>aucun</span>}
                        {l.moisDernier && l.moisDernier < nOuvert && (
                          <div style={{ fontSize: 10, color: AMBRE, marginTop: 2 }}>
                            retard de {nOuvert - l.moisDernier} mois
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                <tr style={{ background: "#F2F5F9" }}>
                  <td style={{ ...tdStyle, fontWeight: 700, fontSize: 12.5, borderTop: "2px solid #DDE3EB" }}>
                    Moyenne des filiales
                  </td>
                  <td colSpan={2} style={{ ...tdStyle, borderTop: "2px solid #DDE3EB", textAlign: "center",
                                           fontSize: 11, color: GRIS }}>
                    filiales non saisies exclues
                  </td>
                  <td style={{ ...tdStyle, borderTop: "2px solid #DDE3EB", textAlign: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, background: NAVY, color: "#FFF",
                                   borderRadius: 5, padding: "4px 10px", display: "inline-block" }}>
                      {moyenneMois == null ? "—" : pct(moyenneMois, 0)}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, borderTop: "2px solid #DDE3EB", textAlign: "center",
                               fontSize: 12, color: "#5B6473" }}>
                    {pct(ind.objectif, 0)}
                  </td>
                  <td style={{ ...tdStyle, borderTop: "2px solid #DDE3EB", textAlign: "center",
                               fontSize: 12.5, fontWeight: 700, color: BLEU }}>
                    {atteignent} / {calculables.length}
                  </td>
                  {compareN1 && n1Disponible && (
                    <td style={{ ...tdStyle, borderTop: "2px solid #DDE3EB" }} />
                  )}
                  <td style={{ ...tdStyle, borderTop: "2px solid #DDE3EB" }} />
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ borderTop: "1px solid #EDEFF2", padding: "12px 18px", fontSize: 11.5,
                        color: "#5B6473", lineHeight: 1.6 }}>
            La colonne <strong>taux</strong> donne la mesure brute, la colonne <strong>atteinte</strong> rapporte
            ce taux à l'objectif réellement applicable à la filiale. Les deux ne donnent pas le même ordre dès
            qu'une dérogation existe. Aucun rang n'est attribué : le tableau se trie, il ne classe pas.
          </div>
        </section>

        <footer style={{ marginTop: 22, fontSize: 11, color: GRIS, textAlign: "center", lineHeight: 1.7 }}>
          Prototype Bloc 3 · Écran V6 — Détail par indicateur · Règles RG-12, RG-13, RG-15, RG-18, RG-22 à RG-28, RG-32<br />
          Groupe ERANOVE — Contrôle Interne Groupe · 11 entités juridiques, 12 filiales déclarantes · Données fictives
        </footer>
      </main>
    </div>
  );
}

/* ---------- Sous-composants ---------- */
const selectStyle = { border: "1px solid #CFD5DE", borderRadius: 6, padding: "8px 10px",
                      fontSize: 13, minWidth: 165, background: "#FFF", color: NAVY, fontFamily: "inherit" };
const tdStyle = { padding: "9px 10px", borderBottom: "1px solid #F1F3F6", fontSize: 12.5, verticalAlign: "middle" };

function Th({ children, onClick, actif, desc, style, title }) {
  return (
    <th onClick={onClick} title={title}
      style={{ padding: "10px 10px", background: "#FAFBFC", borderBottom: "1px solid #E1E5EB",
               fontSize: 11.5, fontWeight: 700, color: actif ? NAVY : "#5B6473", cursor: "pointer",
               textAlign: "center", whiteSpace: "nowrap", userSelect: "none", ...style }}>
      {children}
      {actif && <span style={{ marginLeft: 4, color: VERT }}>{desc ? "▾" : "▴"}</span>}
    </th>
  );
}

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
      <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.1, color: couleur || NAVY }}>{valeur}</div>
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

function Legende({ couleur, texte, tirets }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <svg width="26" height="8"><line x1="0" y1="4" x2="26" y2="4" stroke={couleur} strokeWidth="2.6"
        strokeDasharray={tirets ? "4 3" : "0"} /></svg>
      {texte}
    </span>
  );
}
