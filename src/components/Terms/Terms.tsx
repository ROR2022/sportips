"use client";
import React, {useState, useEffect} from "react";
import {useTranslations} from "next-intl";
import { generateUniqueId } from "@/services/libAux";

const listPolicyES = [
  "1. Aceptación de los Términos",
  "2. Uso de la aplicación",
  "3. Limitación de Responsabilidad",
  "4. Propiedad intelectual",
  "5. Restricciones de uso",
  "6. Cambios en los Términos y Condiciones",
  "7. Exención de Garantías",
];
const listPolicyEN = [
  "1. Acceptance of the Terms",
  "2. Use of the application",
  "3. Limitation of Liability",
  "4. Intellectual Property",
  "5. Use Restrictions",
  "6. Changes in Terms and Conditions",
  "7. Disclaimer of Warranties",
];
const listDescriptionsES = [
  "Al acceder o utilizar la aplicación LiveCoaching, aceptas estar sujeto a estos términos y condiciones, que se aplican a todos los usuarios de la app. Si no estás de acuerdo con estos términos, por favor, no utilices la aplicación.",
  "La aplicación LiveCoaching está destinada para fines educativos y de práctica. El contenido proporcionado por la app es solo para fines informativos y no ofrece garantías ni debe tomarse como un consejo profesional. Los usuarios deben tener en cuenta que la aplicación no es responsable por cualquier decisión tomada basándose en los resultados obtenidos.",
  "LiveCoaching no garantiza la precisión ni la integridad de la información proporcionada. La app puede contener errores o inexactitudes y no se hace responsable por daños directos, indirectos o consecuentes derivados del uso de la información o la toma de decisiones basadas en ella.",
  "Todo el contenido de la app, incluidos textos, gráficos, imágenes, logotipos, íconos, etc., está protegido por derechos de autor y es propiedad exclusiva de LiveCoaching o sus licenciantes. No se permite la reproducción o distribución del contenido sin autorización previa.",
  "Te comprometes a no utilizar la aplicación de manera ilegal, difamatoria o para cualquier actividad que infrinja los derechos de otros usuarios o personas. Cualquier intento de modificar, hackear o alterar el funcionamiento de la app está prohibido.",
  "LiveCoaching se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán actualizados en esta página y entrarán en vigor al ser publicados.",
  "La aplicación se ofrece 'tal cual' y 'según disponibilidad'. No ofrecemos ninguna garantía, explícita o implícita, sobre la exactitud, fiabilidad o disponibilidad de los servicios o el contenido proporcionado. Al usar esta app, aceptas que lo haces bajo tu propio riesgo.",
];
const listDescriptionsEN = [
  "By accessing or using the LiveCoaching application, you agree to be bound by these terms and conditions, which apply to all app users. If you do not agree to these terms, please do not use the application.",
  "The LiveCoaching application is intended for educational and practice purposes. The content provided by the app is for informational purposes only and does not offer guarantees or should be taken as professional advice. Users should be aware that the application is not responsible for any decision made based on the results obtained.",
  "LiveCoaching does not guarantee the accuracy or completeness of the information provided. The app may contain errors or inaccuracies and is not responsible for direct, indirect, or consequential damages resulting from the use of the information or decision-making based on it.",
  "All content of the app, including texts, graphics, images, logos, icons, etc., is protected by copyright and is the exclusive property of LiveCoaching or its licensors. Reproduction or distribution of content without prior authorization is not allowed.",
  "You agree not to use the application illegally, defamatory, or for any activity that infringes the rights of other users or people. Any attempt to modify, hack, or alter the operation of the app is prohibited.",
  "LiveCoaching reserves the right to modify these terms at any time. Changes will be updated on this page and will take effect upon publication.",
  "The application is offered 'as is' and 'as available'. We do not offer any guarantee, explicit or implicit, about the accuracy, reliability, or availability of the services or content provided. By using this app, you agree that you do so at your own risk.",
];

const Terms = () => {
  const t = useTranslations("Terms");
    const [langSelected, setLangSelected] = useState<string>(t("lang"));
    const [listPolicy, setListPolicy] = useState(listPolicyES);
    const [listDescriptions, setListDescriptions] = useState(listDescriptionsES);
  
    useEffect(() => {
      if (langSelected === "es") {
        setListPolicy(listPolicyES);
        setListDescriptions(listDescriptionsES);
      } else {
        setListPolicy(listPolicyEN);
        setListDescriptions(listDescriptionsEN);
      }
    }, [langSelected]);
  
    useEffect(() => {
      if (t("lang") !== langSelected) {
        setLangSelected(t("lang"));
      }
    }, [t("lang")]);
  return (
    <div>
          <div className="container mx-auto px-4 py-10 text-black dark:text-inherit">
            <h1 className="text-3xl font-bold text-center mb-8 ">
              {t("title")}
            </h1>
            {
              listPolicy.map((item, index) => (
                <section key={generateUniqueId()} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{item}</h2>
                  <p>{listDescriptions[index]}</p>
                </section>
              ))
            }
    
            
          </div>
        </div>
  )
}

export default Terms;

/*

1. Aceptación de los Términos

Al acceder o utilizar la aplicación LiveCoaching, aceptas estar sujeto a estos términos y condiciones, que se aplican a todos los usuarios de la app. Si no estás de acuerdo con estos términos, por favor, no utilices la aplicación.

2. Uso de la aplicación

La aplicación LiveCoaching está destinada para fines educativos y de práctica. El contenido proporcionado por la app es solo para fines informativos y no ofrece garantías ni debe tomarse como un consejo profesional. Los usuarios deben tener en cuenta que la aplicación no es responsable por cualquier decisión tomada basándose en los resultados obtenidos.

3. Limitación de Responsabilidad

LiveCoaching no garantiza la precisión ni la integridad de la información proporcionada. La app puede contener errores o inexactitudes y no se hace responsable por daños directos, indirectos o consecuentes derivados del uso de la información o la toma de decisiones basadas en ella.

4. Propiedad intelectual

Todo el contenido de la app, incluidos textos, gráficos, imágenes, logotipos, íconos, etc., está protegido por derechos de autor y es propiedad exclusiva de LiveCoaching o sus licenciantes. No se permite la reproducción o distribución del contenido sin autorización previa.

5. Restricciones de uso

Te comprometes a no utilizar la aplicación de manera ilegal, difamatoria o para cualquier actividad que infrinja los derechos de otros usuarios o personas. Cualquier intento de modificar, hackear o alterar el funcionamiento de la app está prohibido.

6. Cambios en los Términos y Condiciones

LiveCoaching se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán actualizados en esta página y entrarán en vigor al ser publicados.

7. Exención de Garantías

La aplicación se ofrece "tal cual" y "según disponibilidad". No ofrecemos ninguna garantía, explícita o implícita, sobre la exactitud, fiabilidad o disponibilidad de los servicios o el contenido proporcionado. Al usar esta app, aceptas que lo haces bajo tu propio riesgo.

*/