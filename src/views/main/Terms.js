//* COMPONENTE DE TERMINOS Y CONDICIONES
import React from "react";
import { StyleSheet, View, Text } from "react-native";

import AppContainerForm from "../../library/components/AppContainerForm";

export default function Terms({ navigation }) {
  return (
    <AppContainerForm
      navigation={navigation}
      form={false}
      footer={false}
      backButton={true}
      drawerMenu={false}
    >
      <View style={styles.termsContainer}>
        <Text style={[styles.title, { color: "#000" }]}>
          TÉRMINOS DE USO DE TAXI-ZONE
        </Text>
        <Text style={styles.p}>
          Estos términos de servicio constituyen un acuerdo entre usted e
          Taxi-Zone y regulan el uso de la aplicación de Taxi-Zone y de su sitio
          web.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listText}>
            1. Aceptación de los Términos de uso
          </Text>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              1.1 Importante: al utilizar este servicio, usted acepta que leyó,
              entendió, aceptó y está de acuerdo con estos términos y
              condiciones. Además, está de acuerdo con las siguientes
              declaraciones hechas por usted mismo. Si usted no está de acuerdo
              con el servicio o este no corresponde con los términos de uso
              (como se define a continuación) y desea dejar de utilizarlo, no
              continúe utilizando esta aplicación o servicio.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              1.2 Los términos y condiciones que se establecieron aquí
              constituyen un acuerdo legal entre usted e Taxi-Zone y sus
              subsidiarias y filiales. Para poder utilizar el servicio debe
              aceptar los Términos de uso que se establecen a continuación. Al
              utilizar las aplicaciones móviles y los sitios web que le
              proporciona Taxi-Zone (la “Aplicación”), y la descarga, la
              instalación o el uso de cualquier software asociado que suministre
              Taxi-Zone (el “Software”), cuyo objetivo general es permitir que
              las personas que buscan servicios de transporte hacia determinados
              destinos se les pueda canalizar con terceras partes que sean
              proveedores de transporte, conductores y operadores de vehículos.
              Por medio de la presente, usted reconoce y acepta expresamente las
              obligaciones de los Términos de uso y cualquier enmienda o adición
              futura a estos, según se publique de forma periódica a través de
              la Aplicación.{" "}
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              1.3 Taxi-Zone se reserva el derecho de modificar, alterar y
              cambiar los Términos de uso o las políticas que se relacionan con
              el Servicio, en cualquier momento que considere oportuno. Dichas
              modificaciones, variaciones y/o cambios en los Términos de uso o
              en las políticas que se relacionan con el Servicio entrarán en
              vigor cuando se publique una versión actualizada en la Aplicación.
              Usted acepta que será su responsabilidad revisar los Términos de
              uso de forma regular y que además estos términos se aplicarán en
              cualquier país en el cual se beneficie del Servicio, por lo que
              utilizarlo de forma continua después de dichos cambios, ya sea o
              no que los revise, representa el consentimiento y la aceptación de
              estos. Además, acepta que el uso del Servicio en un país alterno
              estará sujeto a los Términos de uso vigentes para dicho país, los
              cuales se pueden consultar mediante la Aplicación.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              1.4 Taxi-Zone solo ofrece servicios a los individuos que se
              encuentren en COLOMBIA
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              1.5 Cada servicio de transporte que proporcione un conductor a un
              pasajero constituirá un acuerdo independiente entre dichas
              personas. Taxi-Zone es una compañía tecnológica que no brinda
              servicios de transporte de manera directa. Taxi-Zone no es un
              proveedor de transporte. Dependerá de las terceras partes que sean
              proveedoras de transporte el ofrecerle estos servicios y será
              decisión de usted el aceptar dichos servicios de transporte. El
              servicio que proporciona la compañía consiste en vincularlo con
              dichos proveedores de transporte, pero no tiene la intención de
              proporcionar servicios de transporte o cualquier otro acto que
              pudiera interpretarse, de alguna manera, como un acto propio de un
              proveedor de transporte. La compañía no es responsable ni culpable
              de los actos y/u omisiones que realice algún proveedor de
              transporte y/o cualquier servicio de transporte que se le
              proporcione.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>2. Elegibilidad</Text>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              2.1 Al utilizar el Servicio, usted declara y garantiza
              explícitamente que tiene derecho legal para aceptar y estar de
              acuerdo con los Términos de uso, y que tiene al menos dieciocho
              (18) años de edad. Sin limitar el carácter general de lo anterior,
              el Servicio no está disponible para personas menores de dieciocho
              (18) años o para aquellas personas a las que se les haya
              prohibido, por cualquier motivo, establecer una relación
              contractual. Al utilizar el Servicio, usted también declara y
              garantiza que tiene el derecho, la autoridad y la capacidad para
              utilizar el Servicio y cumplir con los Términos de uso. Asimismo,
              usted confirma que toda la información que proporcione será
              verdadera y precisa. El servicio es para su uso exclusivo y
              personal. Usted se compromete a que no dará autorización a otros
              para utilizar su identidad o condición de usuario, y no puede
              asignar o transferir su cuenta de usuario a ninguna otra persona o
              entidad. Al utilizar el Servicio, usted acepta cumplir con todas
              las leyes vigentes, ya sea en el país y ciudad en que se encuentre
              mientras utiliza el Servicio
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              2.2 Únicamente podrá tener acceso al Servicio desde los medios
              autorizados. Es su responsabilidad revisar y asegurarse de que
              descargó el Software correcto para su dispositivo. Taxi-Zone no
              será responsable si no cuenta con un dispositivo que sea
              compatible o si descargó una versión incorrecta del Software en su
              dispositivo. Taxi-Zone se reserva el derecho de no permitirle
              utilizar el Servicio en caso de que utilice la aplicación y/o el
              software con un dispositivo que no sea compatible, que no esté
              autorizado o que tenga fines distintos de los que se prevea en el
              software y/o la aplicación
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>3. Tarifas y formas de pago</Text>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              3.1 La "tarifa promedio del viaje" que podemos mostrarle es la
              mediana de las tarifas que las compañías de la red de transporte
              ofrecen al público en general, con respecto a la distancia exacta
              o aproximada que usted seleccionó. Estas tarifas están basadas en
              el momento en que usted solicitó un viaje y en el área que
              seleccionó. No ofrecemos ninguna garantía con respecto a la
              precisión o la integridad de los datos que se utilizan o se
              proporcionan.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              3.2 Usted acepta que este Acuerdo deberá sujetarse a todos los
              impuestos, derechos, tasas, cargos y/o costos legales que estén
              vigentes, cualquiera que sea su denominación bancaria, y que se
              relacionen con cualquier impuesto futuro que pueda introducirse en
              cualquier momento. Además, usted se compromete a hacer todo lo que
              sea necesario y lo que soliciten las leyes pertinentes para
              permitir, ayudar y/o defender a la Empresa a reclamar o revisar
              los créditos fiscales, las compensaciones, los descuentos o las
              devoluciones con respecto a cualquier impuesto que pague o que
              necesite pagar en relación con los Servicios que se le
              proporcionaron conforme a este Acuerdo. Los peajes están incluidos
              en la tarifa que el pasajero pagará
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            4. Concesiones y restricciones de la licencia
          </Text>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              4.1 Sujeto al cumplimiento de estos Términos de uso, Taxi-Zone le
              otorga una licencia limitada, no exclusiva, no transferible,
              revocable y no sublicenciable para:
            </Text>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                4.1.1 El acceso y uso de la Aplicación en su dispositivo
                personal solo con el propósito de utilizar los Servicios; y
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                4.1.2 El acceso y uso de cualquier contenido o material que
                pueda ponerse a disposición a través de los Servicios, en cada
                caso solo para su uso personal y no comercial. Todos los
                derechos no otorgados expresamente a usted por el presente
                documento se reservan por Taxi-Zone y sus licenciantes.{" "}
              </Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Usted no está autorizado </Text>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                1. Eliminar cualquier nota de derecho de autor, marca registrada
                u otros avisos de propiedad de cualquier parte de los Servicios;{" "}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                2. Modificar, crear obras derivadas de, reproducir, distribuir,
                licenciar, arrendar, vender, revender, transferir, presentar
                públicamente, transmitir, retransmitir o explotar los Servicios,
                excepto por el consentimiento expreso por escrito de Taxi-Zone;{" "}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                3. Aplicar ingeniería inversa, descompilar, desensamblar o
                intentar descubrir o cambiar el código fuente de los Servicios,
                excepto como se permita la ley aplicable;{" "}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                4. Enmarcar, enlazar o reflejar cualquier parte de los Servicios{" "}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                5. Causar o ejecutar programas o secuencias de comandos con el
                fin de extraer, indexar, estudiar o realizar cualquier otra
                forma de prospección de datos en cualquier parte de los
                Servicios, sobrecargar intencionalmente o bloquear la operación
                y / o la funcionalidad de cualquier aspecto de los Servicios; o{" "}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                6. Intentar obtener acceso no autorizado o dañar una parte de
                los Servicios o sus sistemas o redes relacionadas.
              </Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              4.2 Usted no podrá (i) otorgar licencias, subcontratar licencias,
              vender, revender, transferir, ceder, distribuir, explotar
              comercialmente de otro modo o poner a disposición de terceros, de
              ninguna manera, la Aplicación y/o el Software; (ii) modificar o
              realizar productos derivados en función de la Aplicación y/o el
              Software; (iii) crear "enlaces" de Internet a la Aplicación o que
              se "enmarquen" o "reproduzcan" en cualquier otro tipo de Software,
              o en cualquier otro servidor o dispositivo, ya sea inalámbrico o
              que esté basado en Internet; (iv) realizar ingeniería inversa o
              acceder al Software para (a) crear un producto o servicio
              competitivo, (b) crear un producto utilizando ideas,
              características, funciones o gráficos que sean similares a los de
              la Aplicación y/o el Software, o (c) copiar cualquiera de las
              ideas, características, funciones o gráficos de la Aplicación y/o
              el Software, (v) lanzar un programa o script automatizado,
              incluidos, pero sin limitarse a, arañas web, rastreadores web,
              robots web, hormigas web, indexadores web, bots, virus o gusanos,
              o cualquier programa que pueda realizar múltiples peticiones por
              segundo en los servidores, o que sobrecargue o dificulte
              indebidamente el funcionamiento y/o desempeño de la Aplicación y/o
              el Software, (vi) utilizar cualquier robot, araña, aplicación para
              búsqueda/recuperación de sitios, u otro dispositivo o proceso ya
              sea manual o automático para recuperar, indexar, "minar datos", o
              reproducir o eludir en cualquier forma la estructura de navegación
              o la presentación de los Servicios o su contenido; (vii) publicar,
              distribuir o reproducir de alguna manera, cualquier material que
              esté protegido por derechos de autor, marcas registradas o algún
              otro tipo de información que esté sujeta a derechos de propiedad
              sin obtener el consentimiento previo del propietario de dichos
              derechos de propiedad, (viii) eliminar cualquier material que esté
              protegido por derechos de autor, marca registrada o algún otro
              tipo de aviso sobre derechos de propiedad que estén incluidos en
              el Servicio.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              4.3 Usted podrá utilizar el Software y/o la Aplicación sólo para
              fines personales y no podrá utilizar el Software y/o la Aplicación
              para: (i) enviar spams, mensajes repetitivos o que no hayan sido
              solicitados; (ii) enviar o almacenar material que incumpla la ley,
              obsceno, amenazador, difamatorio o que de alguna manera sea ilegal
              o indebido, incluidos pero no limitados a, materiales que sean
              perjudiciales para los niños o que violen los derechos de
              privacidad de terceros; (iii) enviar materiales que contengan
              virus de software, gusanos, troyanos u otros códigos, archivos,
              scripts, agentes o programas informáticos que sean perjudiciales;
              (iv) interferir o alterar de alguna manera la integridad o el
              desempeño del Software y/o la Aplicación, o los datos contenidos
              en los mismos; (v) intentar obtener acceso no autorizado al
              Software y/o la Aplicación, a sus sistemas o a las redes que estén
              relacionadas con los mismos; o (vi) suplantar la identidad de
              cualquier persona o entidad, o falsificar de algún modo su
              afiliación con una persona o entidad (vii) abstenerse de realizar
              cualquier conducta que pudiera dañar la reputación de la Empresa o
              que sea equiparable a alguna conducta de dudosa reputación.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              4.4 Usted podrá utilizar el Software y/o la Aplicación sólo para
              fines personales y no podrá utilizar el Software y/o la Aplicación
              para: (i) enviar spams, mensajes repetitivos o que no hayan sido
              solicitados; (ii) enviar o almacenar material que incumpla la ley,
              obsceno, amenazador, difamatorio o que de alguna manera sea ilegal
              o indebido, incluidos pero no limitados a, materiales que sean
              perjudiciales para los niños o que violen los derechos de
              privacidad de terceros; (iii) enviar materiales que contengan
              virus de software, gusanos, troyanos u otros códigos, archivos,
              scripts, agentes o programas informáticos que sean perjudiciales;
              (iv) interferir o alterar de alguna manera la integridad o el
              desempeño del Software y/o la Aplicación, o los datos contenidos
              en los mismos; (v) intentar obtener acceso no autorizado al
              Software y/o la Aplicación, a sus sistemas o a las redes que estén
              relacionadas con los mismos; o (vi) suplantar la identidad de
              cualquier persona o entidad, o falsificar de algún modo su
              afiliación con una persona o entidad (vii) abstenerse de realizar
              cualquier conducta que pudiera dañar la reputación de la Empresa o
              que sea equiparable a alguna conducta de dudosa reputación.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            5. Titularidad de la propiedad intelectual: el servicio incluye
            diversos tipos de contenidos (por ejemplo, diseño, imágenes,
            sonidos, textos, bases de datos, códigos informáticos, marcas
            registradas y no registradas, y otros elementos similares) que
            pertenecen o están bajo licencia de Taxi-Zone, los cuales a su vez
            están protegidos por los derechos de autor, las marcas registradas,
            las patentes, los secretos comerciales y otras leyes. Taxi-Zone y
            los titulares de sus licencias, cuando corresponda, serán
            propietarios de todos los derechos, títulos e intereses, incluidos
            todos los derechos de propiedad intelectual que estén relacionados,
            sobre el software y/o la aplicación y, por consiguiente, sobre el
            servicio y cualquier sugerencia, idea, solicitud para mejorar,
            comentario, recomendación o algún otro tipo de información que
            proporcione o cualquier otra parte relacionada con el servicio. los
            términos de uso no constituyen un acuerdo de venta y no le confieren
            a usted ningún derecho de propiedad sobre el servicio, el software
            y/o la aplicación, o cualquier derecho de propiedad intelectual que
            pertenezca a Taxi-Zone y/o a los titulares de sus licencias. el
            nombre y el logotipo de Taxi-Zone, el servicio, el software y/o la
            aplicación, los logotipos de los proveedores de transporte y los
            nombres de los productos que estén asociados con el software y/o la
            aplicación son marcas registradas de Taxi-Zone o de terceros, y no
            se le concede ningún derecho o licencia para utilizarlos. con el fin
            de evitar cualquier duda, en este documento los términos "software"
            y "aplicación" incluirán a sus respectivos componentes, procesos y
            diseño en su totalidad.
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            6. Actividades restringidas. Con respecto al uso que haga de
            Taxi-Zone y su participación en los Servicios, usted acepta que no:
          </Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              a) Suplantará a ninguna persona o entidad
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              b) Acosará, amenazará o molestará de otra manera a ninguna
              persona, o portará algún tipo de arma
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              c) Violará ninguna ley, estatuto, decreto o regulación
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              d) interferirá o interrumpirá los Servicios, los servidores o las
              redes que se conecten a Taxi-Zone
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              e) Publicará información o interactuará con la aplicación, o los
              servicios de Taxi-Zone de alguna forma que sea falsa, inexacta,
              engañosa (directamente o por omisión, o incapacidad para
              actualizar la información), difamatoria, calumniosa, abusiva,
              obscena, profana, ofensiva, con orientación sexual, amenazante,
              acosadora o ilegal
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              f) Utilizará Taxi-Zone de cualquier forma que infrinja los
              derechos de terceros, los cuales incluyen pero no se limitan a:
              los derechos de propiedad intelectual, derechos de autor,
              patentes, marcas comerciales, secretos comerciales u otros
              derechos de propiedad, de publicidad o de privacidad
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              g) Publicará, enviará por correo electrónico o transmitirá
              cualquier código, archivo o programa malicioso que esté diseñado
              para interrumpir, dañar, destruir o limitar la funcionalidad de
              cualquier software o hardware informático, o equipo de
              telecomunicaciones, ni interceptará o expropiará clandestinamente
              cualquier sistema, dato o información personal
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              h) Falsificará encabezados o manipulará, de ninguna manera, a los
              identificadores para ocultar el origen de cualquier tipo de
              información que se transmita mediante Taxi-Zone
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              i) Modificará, adaptará, traducirá, realizará ingeniería inversa,
              descifrará, descompilará o desensamblará cualquier parte del
              Software o cualquier software que se utilice en o para Taxi-Zone;
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              j) Rentará, arrendará, prestará, venderá, redistribuirá, otorgará
              licencias o subcontratará licencias de la aplicación de Taxi-Zone
              y del Sitio o accederá de manera indebida a cualquiera de las
              partes de Taxi-Zone
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              k) Utilizará cualquier robot, araña, aplicación para recuperación
              de la información/buscador, u otro dispositivo o proceso ya sea
              manual o automático para recuperar, indexar, reunir, “minar
              datos”, o que implique cualquier forma de reproducir o evitar la
              estructura de navegación o la presentación de Taxi-Zone o sus
              contenidos
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              l) Generará responsabilidades para nosotros o hará que estemos
              sujetos a una regulación como prestadores de servicios de
              transporte o proveedores de servicios de taxi;
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              m) Se enlazará directa o indirectamente a ningún otro sitio web
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              n) Transferirá o venderá su cuenta de usuario, contraseña y/o
              identificación a ningún otro tercero; o
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              o) Causará que un tercero se involucre en las actividades
              restringidas que se mencionaron anteriormente
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>7. Confidencialidad</Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              7.1 Usted deberá mantener en secreto toda la información y los
              datos que se relacionen con Taxi-Zone, sus servicios, productos,
              asuntos de negocios, planes de comercialización y promociones, o
              cualquier otro tipo de operaciones y las compañías que se asocien
              con ellas, las cuales se dan a conocer ante usted por o en nombre
              de Taxi-Zone (ya sea oralmente o por escrito, e independientemente
              de que esto ocurra antes, durante o después de la fecha en que se
              realiza este Acuerdo) o que se adquieran de otra manera, ya sea
              directa o indirectamente por usted de parte de Taxi-Zone, por
              cualquiera de sus compañías afiliadas, o se generen en el
              transcurso del presente Acuerdo. Además, deberá asegurarse de que
              esta empresa, sus funcionarios, empleados y agentes sólo utilicen
              dicha información confidencial con el único fin de cumplir con sus
              Servicios, y no podrán revelar dicha información a terceros, ni
              utilizarla para ningún otro propósito sin la autorización previa y
              por escrito de Taxi-Zone. Usted sólo revelará dicha información a
              los funcionarios, empleados y agentes que necesiten conocerla para
              cumplir con sus obligaciones según el presente Acuerdo
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              7.2 Usted acepta seguir todas las medidas razonables para proteger
              los secretos y evitar la divulgación o el uso de la información
              confidencial de Taxi-Zone, con el fin de evitar que sean del
              dominio público. A pesar de todo lo que se mencionó anteriormente,
              usted no tendrá responsabilidad ante Taxi-Zone en lo relacionado
              con cualquier tipo de Información confidencial que pueda probar:
              debido a que ya era del dominio público en el momento en que fue
              descubierto por Taxi-Zone o se volvió del dominio público por
              causas que son ajenas a su voluntad, ya era de su conocimiento y
              no tenía ninguna restricción en el momento de la divulgación, tal
              y como lo demuestran los archivos que existen en el momento de la
              divulgación, es revelado con la aprobación previa por escrito de
              Taxi-Zone; sea conocido por usted, sin restricción, de una fuente
              que no sea Taxi-Zone sin que usted haya violado este Acuerdo y que
              de otra manera no viole los derechos de Taxi-Zone; o sea divulgado
              de conformidad con la orden o por la decisión de un tribunal,
              agencia administrativa u otro organismo gubernamental, siempre y
              cuando, sin embargo, usted notifique de inmediato de dicha orden o
              requerimiento judicial para que Taxi-Zone pueda solicitar una
              orden de protección, impedir o restringir, de algún otro modo, que
              se realice dicha divulgación.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            8. Protección de la información personal
          </Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              8.1 Usted acepta y otorga su consentimiento para que Taxi-Zone
              utilice y procese su Información personal para los Propósitos y en
              la forma que se indican a continuación.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              8.2 Para los fines de este Acuerdo, "Información personal"
              significa la información sobre usted, y con la cual es posible
              identificarlo, lo que incluye pero no se limita a su nombre,
              número de tarjeta de identificación, dirección, número de
              teléfono, los datos de su tarjeta de crédito o débito, sexo, fecha
              de nacimiento, dirección de correo electrónico, cualquier tipo de
              información sobre usted que haya proporcionado a Taxi-Zone ya sea
              en los formularios de registro, formularios de solicitud o en
              cualquier otro formulario similar y/o cualquier tipo de
              información sobre usted que haya sido o pueda ser recopilada,
              almacenada, utilizada y procesada por Taxi-Zone ocasionalmente, y
              esto incluye datos personales sensibles.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              Proporcionar su información personal es voluntario. Sin embargo,
              si no proporciona su información personal a Taxi-Zone, es posible
              que no pueda acceder completamente a la Aplicación, ya que
              Taxi-Zone no podrá procesar su información personal conforme a los
              propósitos que se indican a continuación y esto además puede
              ocasionar que Taxi-Zone no le permita utilizar el Servicio.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              8.3 Usted acepta que Taxi-Zone pueda comunicarse con usted por
              teléfono o mediante mensajes de texto (incluso con la ayuda de un
              sistema automático de marcación telefónica) a cualquiera de los
              números de teléfono que proporcionó o que se encuentran a su
              nombre y estén asociados a una cuenta de Taxi-Zone, incluso con
              propósitos comerciales. Usted comprende que no está obligado a
              otorgar su consentimiento como condición para adquirir cualquier
              propiedad, bienes o servicios.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              8.4 La recopilación y el uso de la información personal se
              relaciona con los Servicios que se describen en la Política de
              privacidad de Taxi-Zone, la cual se encuentra disponible en:
              www.taxizone.com.co/terminosdeuso.html
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>9. Indemnizaciones</Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              9.1 Al aceptar los Términos de uso cuando utilice el Servicio,
              usted acepta que defenderá, indemnizará y eximirá de
              responsabilidades a Taxi-Zone, sus funcionarios, directores,
              miembros, empleados, abogados y agentes de y contra cualquier tipo
              de reclamos, costos, daños, pérdidas, responsabilidades y gastos
              (incluyendo los honorarios y el costo de los abogados) que
              resulten por o tengan relación con el mismo: (a) el uso que haga
              del Servicio, el Software y/o la Aplicación, el trato que tenga
              con los terceros que sean Proveedores de transporte, proveedores
              de terceros, socios, publicistas y/o patrocinadores, o (b) la
              violación o el incumplimiento de cualquiera de los Términos de Uso
              o de cualquier ley o regulación aplicable, ya sea que se haga, o
              no, referencia a ellos en el presente documento o (c) la violación
              de cualquier derecho de terceros, incluidos los terceros que sean
              Proveedores de transporte y se hayan contratado a través del
              Servicio, o (d) el uso, o el uso indebido que se haga del
              Servicio, el Software y/o la Aplicación.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            10. Descargo de responsabilidad de las garantías
          </Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              10.1 Taxi-Zone no realiza ninguna declaración, garantía o promesa
              en cuanto a la fiabilidad, la puntualidad, la calidad, la
              conveniencia, la disponibilidad, la exactitud o la integridad de
              los servicios, la aplicación y/o el software. Taxi-Zone no declara
              ni garantiza que: (a) el uso del servicio, la aplicación y/o el
              software sea seguro, oportuno, ininterrumpido, esté libre de
              errores, o que opere en combinación con cualquier otro tipo de
              hardware, software, sistema o conjunto de datos, (b) el servicio
              cumpla con sus necesidades o expectativas, (c) los datos
              almacenados sean exactos o confiables, (d) la calidad de cualquier
              producto, servicio o información, u otros materiales que compre u
              obtenga mediante la aplicación cumplirán con sus necesidades o
              expectativas, (e) los errores o defectos en la aplicación y/o el
              software serán corregidos, o (f) la aplicación o los servidores
              que se encuentren en la aplicación estarán libres de virus u otros
              componentes dañinos, o (g) la aplicación y/o el software lo
              rastrearán a usted o al vehículo que utilice el proveedor de
              transporte. el servicio se le proporciona estrictamente con el
              criterio “tal y como está”. Todas las condiciones, declaraciones y
              garantías, ya sean explícitas, sean implícitas, se establezcan por
              la ley o sean de otro tipo, incluyendo las que no tengan
              limitaciones, cualquier garantía implícita de valor comercial,
              aptitud para un propósito en particular, o que no transgredan los
              derechos de terceras partes, quedarán excluidas por la presente y
              se rechazarán en la mayor y máxima medida. La empresa no realiza
              ninguna declaración, garantía, o promesa con respecto a la
              confiabilidad, la seguridad, la puntualidad, la calidad, la
              conveniencia o disponibilidad de cualquier servicio, que incluye,
              pero no se limita a los servicios de transporte brindados por
              terceros a través del uso del servicio, la aplicación y/o el
              software. Reconoce y acepta que todo el riesgo que derive de la
              utilización del servicio, y cualquiera de los servicios brindados
              por terceros, lo que incluye, pero no se limita a, los servicios
              de transporte brindados por terceros, recae única y absolutamente
              en usted y no podrá ejercer ningún recurso legal, bajo ningún
              concepto, ante la empresa.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              10.2 El servicio, la aplicación y/o el software pueden estar
              sujetos a limitaciones, retrasos y otros problemas inherentes al
              uso del Internet y a las comunicaciones digitales, lo cual incluye
              que los dispositivos que utilizan ya sean usted o las terceras
              partes que sean proveedoras de transporte sean deficientes, no se
              conecten, estén fuera de la cobertura, apagados o no funcionen. La
              empresa no se hace responsable por los retrasos, fallos en la
              entrega, daños o pérdidas que resulten de dichos problemas
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            11. Limitación de la responsabilidad
          </Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              11.1 Cualquier reclamación que realice en contra de Taxi-Zone se
              limitará, en cualquier caso, al monto total de todas las
              cantidades que en realidad pagó y/o que adeude por utilizar el
              servicio durante el evento que originó dichas reclamaciones. En
              ningún caso la empresa y/o los titulares de sus licencias serán
              responsables ante usted o ante cualquier persona por cualquier
              daño o pérdida ya sea directa o indirecta, punitiva, económica,
              futura, especial, ejemplar, incidental, consecuente u otros daños
              o pérdidas de cualquier tipo o clase (que incluyan daños
              personales, sufrimiento emocional y pérdida de datos, bienes,
              ingresos, ganancias, usos u otra ventaja económica). Taxi-Zone y/o
              los titulares de sus licencias no serán responsables por ninguna
              pérdida, daño o lesión que pueda sufrir o sea causada por usted o
              por cualquier persona para la que haya reservado el servicio,
              incluidas, entre otras, las pérdidas, daños o lesiones que se
              deriven, o tengan alguna relación con el servicio, la aplicación
              y/o el software, como por ejemplo, el uso o la imposibilidad de
              utilizar el servicio, la aplicación y/o el software, cualquier
              tipo de confianza que haya puesto en la integridad, fiabilidad o
              existencia en la publicidad, o como resultado de cualquier
              relación o transacción que haya entre usted y algún proveedor
              externo, publicista o patrocinador cuya publicidad aparezca en el
              sitio web o a la que se haga referencia por el servicio, la
              aplicación y/o el software, incluso si la empresa y/o los
              titulares de sus licencias han sido advertidos previamente sobre
              la posibilidad de que se produzcan tales daños. La empresa no se
              encarga de la evaluación ni la supervisión la conveniencia, la
              legalidad, la capacidad, el recorrido o la ubicación de los
              proveedores de terceros, incluidas las terceras partes que sean
              proveedoras de transporte, los publicistas y/o los patrocinadores,
              y usted renuncia expresamente y libera a la empresa de cualquier
              responsabilidad, reclamación o daño que surja de o se relacione de
              alguna manera con los proveedores de terceros, incluidas las
              terceras partes que sean proveedoras de transporte, los
              publicistas y/o los patrocinadores. Taxi-Zone no formará parte de
              disputas, ni de negociaciones para resolver disputas entre usted y
              proveedores externos, incluyendo a terceras partes que sean
              proveedoras de transporte, publicistas y/o patrocinadores. No
              podemos y no desempeñaremos ningún papel en la administración de
              los pagos entre usted y los proveedores externos, incluyendo a
              terceras partes que sean proveedoras de transporte, publicistas
              y/o los patrocinadores. La responsabilidad de las decisiones que
              usted tome con respecto a los servicios y productos que se ofrecen
              mediante el servicio, el software y/o la aplicación (con todas sus
              implicaciones) recae exclusivamente en usted. Renuncia
              expresamente y libera a la empresa de cualquier responsabilidad,
              reclamo, causa de acción o daño que surja del uso del servicio, el
              software y/o la aplicación, o que se relaciones de cualquier forma
              con terceros, incluyendo terceras partes que sean proveedoras de
              transporte, publicistas y/o patrocinadores que se introdujeron
              para usted por el servicio, el software y/o la aplicación.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              11.2 La calidad de los servicios de transporte que proporcionen
              terceras partes y se programen mediante el uso del servicio, es
              enteramente responsabilidad de las terceras partes que sean
              proveedoras de transporte quienes, en última instancia, le
              proporcionan dichos servicios de transporte. Por lo tanto, usted
              comprende que al utilizar el servicio puede estar expuesto a un
              transporte que sea potencialmente peligroso, ofensivo, dañino para
              los menores, inseguro o inaceptable de alguna otra manera, y que
              usted utiliza el servicio bajo su propio riesgo.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            12. Contenido proporcionado por el usuario
          </Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              12.1 Taxi-Zone puede permitir ocasionalmente que los usuarios
              publiquen su propio contenido ("Contenido proporcionado por el
              Usuario") al que pueden acceder otros usuarios del Servicio.
              Taxi-Zone no tiene la obligación de vigilar el contenido
              proporcionado por el Usuario o el uso que se haga del Servicio, o
              de conservar el contenido que publique algún usuario en las
              secciones de Contenido publicado por el usuario del Servicio.
              Usted no puede proporcionar material que sea difamatorio,
              calumnioso, que incite al odio, violento, obsceno, pornográfico,
              ilegal o que sea ofensivo de alguna manera, según lo determine
              Taxi-Zone con su propio criterio, independientemente de que dicho
              material esté o no protegido por la ley o por el contenido
              proporcionado por el Usuario.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              12.2 Taxi-Zone no reclama la propiedad de ningún contenido
              proporcionado por los usuarios. Al enviar, publicar o mostrar
              contenido proporcionado por los Usuarios, usted le otorga a
              Taxi-Zone una licencia permanente, irrevocable, internacional,
              libre de regalías y no exclusiva para la reproducción, adaptación,
              modificación, traducción, publicación, representación o mostrar y
              distribuir públicamente cualquier contenido proporcionado por el
              Usuario que usted envíe, publique o muestre en o mediante el sitio
              web. Esta licencia tiene el único propósito de permitir que
              Taxi-Zone muestre, represente públicamente, distribuya y promueva
              el contenido proporcionado por el Usuario y el sitio web.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              12.3 Taxi-Zone se reserva el derecho, a su entero y absoluto
              criterio, de modificar o eliminar cualquier tipo de información,
              que se almacene o publique en el sitio web.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              12.4 Taxi-Zone no asume ninguna responsabilidad por el contenido
              que sea proporcionado por los Usuarios.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            13. Ley vigente. Este Acuerdo, sus derechos y los derechos de
            Taxi-Zone dentro de este Acuerdo se regirán e interpretarán de
            conformidad con la ley del país de residencia del Demandado.
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            14. Notificaciones. Taxi-Zone puede dar a conocer información
            mediante una notificación general en la Aplicación, enviar mensajes
            a la dirección de correo electrónico que registró en Taxi-Zone, o
            mediante comunicaciones por escrito que se envíen por correo
            certificado o correo de prepago a la dirección que proporcionó en
            los registros de Taxi-Zone. Se considerará que dicha notificación se
            entregó después de que transcurrieron 48 horas desde el envío por
            correo o por correo postal, (si se realizó por correo certificado o
            por correo de prepago) o 1 hora después del envío (si se realizó por
            correo electrónico). Puede dar a conocer información a Taxi-Zone (se
            considerará que dicha notificación se entregó cuando la reciba
            Taxi-Zone) mediante una carta, la cual puede enviar través del
            servicio de mensajería o por correo certificado a Taxi-Zone, para
            ello utilice la información de contacto que se indica en la
            Aplicación.
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            15. Asignación. El acuerdo, tal como se estableció en los Términos
            de uso, los cuales se modifican periódicamente, no podrá asignarse
            por usted sin la autorización previa por escrito de Taxi-Zone, pero
            Taxi-Zone puede asignarlo sin su consentimiento. Cualquier presunta
            asignación con la que usted cometa una infracción a esta sección
            será nula.
          </Text>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>16. Disposiciones generales</Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              16.1 Ninguna excepción a cualquiera de los términos del Acuerdo se
              considerará una excepción permanente o continua de dicho término o
              de cualquier otro, y el hecho de que no se haga valer algún
              derecho o cláusula conforme a este Acuerdo no constituirá una
              excepción a dicho término. Si por alguna razón una corte con
              jurisdicción competente encuentra que cualquier cláusula o sección
              de este Acuerdo no es aplicable, entonces tal cláusula o sección
              deberá interpretarse, en la medida de lo posible, para que refleje
              a la cláusula original y el resto del Acuerdo continuará en plena
              vigencia y efecto. El Acuerdo y todos los derechos, y licencias
              concedidas que se originen del mismo, no pueden ser transferidos o
              asignados por usted, pero nosotros podemos asignarlos sin
              restricciones. Los títulos que se encuentran en las secciones del
              Acuerdo se utilizan únicamente por comodidad y no tienen ningún
              significado legal o contractual. Ninguna cláusula que se encuentre
              en el Acuerdo se interpretará en contra de los propietarios de
              este sitio, sino que se interpretarán de forma neutral y justa,
              como los términos que se celebraron por una parte plenamente
              informada y de manera voluntaria. Los términos del Acuerdo, los
              cuales por sus características deben prevalecer hasta la
              finalización del Acuerdo, prevalecerán hasta que ocurra dicha
              finalización. Los encabezados de referencia que se mencionan aquí
              únicamente tienen fines de comodidad, no constituyen una parte de
              estos Términos y no se considerará que limitan o afectan a ninguna
              de las cláusulas de este documento. Usted acepta que no existe
              ningún tipo de negocio conjunto, asociación, empleo o relación de
              agencia entre usted y nosotros como resultado de estos Términos de
              uso del Sitio, la Aplicación o los Servicios. Además, usted
              reconoce que el envío de materiales por parte del Usuario u otro
              tipo de contenido, no implica que existe algún tipo de relación
              confidencial, fiduciaria, contractual o de otro tipo entre Usted y
              Nosotros, que no sea de conformidad con estos Términos.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              16.2 Es posible que le notifiquemos por correo electrónico,
              mediante un anuncio en el Sitio o de alguna otra manera que
              consideremos adecuada. Usted debe enviarnos notificaciones por
              escrito mediante correos electrónicos, o de cualquier otra forma
              que se haya establecido previamente.
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listText}>
            17. Renuncia a reclamaciones colectivas
          </Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              17.1 Al aceptar voluntariamente este Acuerdo, Usted acepta que, en
              su totalidad, conforme a la ley aplicable, la demanda judicial o
              los procedimientos de arbitraje relacionados con este Acuerdo se
              llevan a cabo exclusivamente de forma individual, y que no serán
              consideradas las demandas sobre la base de reclamaciones
              colectivas o las demandas con representación en nombre de
              terceros.{"\n"}
              Las disputas no se pueden ser integradas sin el consentimiento por
              escrito de todas las partes. Ninguna decisión o determinación del
              tribunal o árbitro tendrá una fuerza prejudicial sobre los asuntos
              o reclamaciones en cualquier disputa con personas que no sean las
              partes declaradas en dichos procedimientos de arbitraje.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              Esto significa lo siguiente:
            </Text>
            <View style={styles.listItem}>
              <Text Text style={styles.listItemText}>
                a. Usted acepta que no puede presentar una reclamación como
                demandante o participante en una demanda colectiva, una demanda
                integrada o una demanda representativa.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text Text style={styles.listItemText}>
                b. Las partes convienen en que el árbitro o el tribunal no puede
                integrar las reclamaciones de más de una persona en una sola
                demanda, y tampoco puede llevar a cabo procedimientos arbitrales
                o de reclamación de carácter integrado, colectivo o
                representativo (a menos que todas las partes estén de acuerdo en
                cambiar esto).
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text Text style={styles.listItemText}>
                c. Las partes convienen en que la decisión o determinación de un
                árbitro o tribunal en el caso de una reclamación de una persona
                solo se aplica a la persona que presentó esta demanda, pero no a
                otras personas, y no puede ser utilizada para resolver otras
                disputas con otros demandantes
              </Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              17.2 Una vez que Usted visite nuestro sitio web y descargue y
              utilice nuestra aplicación, Usted acepta que las leyes de su país
              de residencia, sin violar los principios de conflicto de leyes,
              son jurídicamente vinculantes con respeto a estos Términos y
              cualquier disputa de cualquier tipo que pueda surgir entre
              nosotros.
            </Text>
          </View>
        </View>
      </View>
    </AppContainerForm>
  );
}

const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  p: {
    fontSize: 16,
    textAlign: "justify",
    marginVertical: 10,
  },
  list: {
    marginLeft: 10,
    marginBottom: 10,
  },
  listText: {
    fontSize: 16,
    textAlign: "justify",
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 16,
    textAlign: "justify",
  },
});
